import ordersData from "@/services/mockData/orders.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const OrderService = {
  async getAll() {
    await delay(300);
    return [...ordersData];
  },

  async getById(id) {
    await delay(200);
    const order = ordersData.find(o => o.Id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async getByBuyerId(buyerId) {
    await delay(250);
    return ordersData.filter(o => o.buyerId === buyerId).map(o => ({ ...o }));
  },

  async getBySupplierId(supplierId) {
    await delay(250);
    return ordersData.filter(o => o.supplierId === supplierId).map(o => ({ ...o }));
  },

  async create(orderData) {
    await delay(500);
    const maxId = Math.max(...ordersData.map(o => o.Id));
    const newOrder = {
      Id: maxId + 1,
      buyerId: 4, // Mock buyer ID
      buyerName: "Current User",
      supplierId: orderData.items[0]?.supplierId || 1,
      items: orderData.items,
      subtotal: orderData.subtotal,
      commission: orderData.commission,
      total: orderData.total,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    ordersData.push(newOrder);
    return { ...newOrder };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    
    ordersData[index].status = status;
    return { ...ordersData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = ordersData.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Order not found");
    }
    
    const deleted = ordersData.splice(index, 1)[0];
    return { ...deleted };
  }
};