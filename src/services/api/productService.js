import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductService = {
  async getAll() {
    await delay(300);
    return [...productsData];
  },

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async getBySupplierId(supplierId) {
    await delay(250);
    return productsData.filter(p => p.supplierId === supplierId).map(p => ({ ...p }));
  },

  async getByCategory(category) {
    await delay(250);
    return productsData.filter(p => p.category === category).map(p => ({ ...p }));
  },

  async search(query) {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return productsData.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.supplierName.toLowerCase().includes(lowerQuery)
    ).map(p => ({ ...p }));
  },

  async create(productData) {
    await delay(400);
    const maxId = Math.max(...productsData.map(p => p.Id));
    const newProduct = {
      Id: maxId + 1,
      ...productData,
      createdAt: new Date().toISOString()
    };
    productsData.push(newProduct);
    return { ...newProduct };
  },

  async update(id, updateData) {
    await delay(350);
    const index = productsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    productsData[index] = { ...productsData[index], ...updateData };
    return { ...productsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = productsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    const deleted = productsData.splice(index, 1)[0];
    return { ...deleted };
  }
};