import suppliersData from "@/services/mockData/suppliers.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const SupplierService = {
  async getAll() {
    await delay(300);
    return [...suppliersData];
  },

  async getById(id) {
    await delay(200);
    const supplier = suppliersData.find(s => s.Id === id);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    return { ...supplier };
  },

  async getByUserId(userId) {
    await delay(250);
    const supplier = suppliersData.find(s => s.userId === userId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    return { ...supplier };
  },

  async create(supplierData) {
    await delay(400);
    const maxId = Math.max(...suppliersData.map(s => s.Id));
    const newSupplier = {
      Id: maxId + 1,
      ...supplierData,
      subscriptionStatus: "trial",
      subscriptionTier: "Basic",
      joinedAt: new Date().toISOString()
    };
    suppliersData.push(newSupplier);
    return { ...newSupplier };
  },

  async update(id, updateData) {
    await delay(350);
    const index = suppliersData.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    
    suppliersData[index] = { ...suppliersData[index], ...updateData };
    return { ...suppliersData[index] };
  },

  async updateSubscriptionStatus(id, status) {
    await delay(300);
    const index = suppliersData.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    
    suppliersData[index].subscriptionStatus = status;
    return { ...suppliersData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = suppliersData.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    
    const deleted = suppliersData.splice(index, 1)[0];
    return { ...deleted };
  }
};