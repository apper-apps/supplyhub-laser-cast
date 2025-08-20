import ordersData from "@/services/mockData/orders.json";
import suppliersData from "@/services/mockData/suppliers.json";
import usersData from "@/services/mockData/users.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AdminService = {
  async getDashboardMetrics(timeRange = "30") {
    await delay(400);
    
    // Calculate metrics based on mock data
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    const subscriptionRevenue = suppliersData.filter(s => s.subscriptionStatus === "active").length * 300;
    const commissionRevenue = ordersData.reduce((sum, order) => sum + order.commission, 0);
    const advertisingRevenue = 2500; // Mock advertising revenue
    
    const totalSuppliers = suppliersData.length;
    const activeSuppliers = suppliersData.filter(s => s.subscriptionStatus === "active").length;
    const totalBuyers = usersData.filter(u => u.role === "buyer").length;

    // Mock recent orders with buyer names
    const recentOrders = ordersData.slice(0, 5).map(order => ({
      ...order,
      buyerName: order.buyerName || "Anonymous Buyer"
    }));

    // Mock top suppliers with performance metrics
    const topSuppliers = suppliersData.map(supplier => {
      const supplierOrders = ordersData.filter(o => o.supplierId === supplier.Id);
      const totalRevenue = supplierOrders.reduce((sum, order) => sum + order.subtotal, 0);
      
      return {
        Id: supplier.Id,
        companyName: supplier.companyInfo.name,
        totalOrders: supplierOrders.length,
        totalProducts: Math.floor(Math.random() * 20) + 5, // Mock product count
        totalRevenue,
        subscriptionStatus: supplier.subscriptionStatus
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Mock monthly revenue data
    const monthlyRevenue = [
      { month: "Jan", revenue: 45000, subscriptions: 9000, commissions: 1200, advertising: 800 },
      { month: "Feb", revenue: 52000, subscriptions: 9300, commissions: 1400, advertising: 900 },
      { month: "Mar", revenue: 48000, subscriptions: 9600, commissions: 1300, advertising: 950 },
      { month: "Apr", revenue: 61000, subscriptions: 9900, commissions: 1600, advertising: 1100 },
      { month: "May", revenue: 58000, subscriptions: 9900, commissions: 1500, advertising: 1050 },
      { month: "Jun", revenue: 67000, subscriptions: 9900, commissions: 1800, advertising: 1200 }
    ];

    return {
      totalRevenue,
      subscriptionRevenue,
      commissionRevenue,
      advertisingRevenue,
      totalOrders,
      totalSuppliers,
      activeSuppliers,
      totalBuyers,
      recentOrders,
      topSuppliers,
      monthlyRevenue
    };
  },

  async getOrderAnalytics(timeRange = "30") {
    await delay(350);
    
    const orders = ordersData;
    const statusBreakdown = {
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length
    };

    return {
      totalOrders: orders.length,
      statusBreakdown,
      averageOrderValue: orders.reduce((sum, o) => sum + o.total, 0) / orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0)
    };
  },

  async getSupplierAnalytics(timeRange = "30") {
    await delay(350);
    
    const suppliers = suppliersData;
    const statusBreakdown = {
      active: suppliers.filter(s => s.subscriptionStatus === "active").length,
      trial: suppliers.filter(s => s.subscriptionStatus === "trial").length,
      inactive: suppliers.filter(s => s.subscriptionStatus === "inactive").length
    };

    return {
      totalSuppliers: suppliers.length,
      statusBreakdown,
      subscriptionRevenue: statusBreakdown.active * 300,
      averageRevenue: 15000 // Mock average supplier revenue
    };
  },

  async updateSupplierStatus(supplierId, status) {
    await delay(300);
    const index = suppliersData.findIndex(s => s.Id === supplierId);
    if (index === -1) {
      throw new Error("Supplier not found");
    }
    
    suppliersData[index].subscriptionStatus = status;
    return { ...suppliersData[index] };
  }
};