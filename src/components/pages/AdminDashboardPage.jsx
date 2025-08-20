import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { AdminService } from "@/services/api/adminService";
import { format, subDays } from "date-fns";

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30"); // days

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await AdminService.getDashboardMetrics(timeRange);
      setDashboardData(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const {
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
  } = dashboardData;

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      icon: "DollarSign",
      color: "success",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: "+8.2%",
      icon: "ShoppingBag",
      color: "primary-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Active Suppliers",
      value: activeSuppliers.toLocaleString(),
      change: "+5.1%",
      icon: "Building",
      color: "secondary-400",
      bgColor: "bg-cyan-100"
    },
    {
      title: "Total Buyers",
      value: totalBuyers.toLocaleString(),
      change: "+15.3%",
      icon: "Users",
      color: "warning",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Platform performance and analytics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <Button variant="primary">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-success font-medium">
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className={`w-8 h-8 text-${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CreditCard" className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Subscriptions</h4>
            <p className="text-2xl font-bold text-primary-600 mt-2">
              ${subscriptionRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Monthly recurring revenue</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Percent" className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Commissions</h4>
            <p className="text-2xl font-bold text-secondary-400 mt-2">
              ${commissionRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">3% on all transactions</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-warning to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Megaphone" className="w-10 h-10 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">Advertising</h4>
            <p className="text-2xl font-bold text-warning mt-2">
              ${advertisingRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Featured listings & ads</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Button variant="outline" size="sm">
              View All Orders
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-card hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Package" className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order.Id.toString().padStart(6, "0")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.buyerName} • {format(new Date(order.createdAt), "MMM dd, hh:mm a")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">
                    ${order.total.toFixed(2)}
                  </p>
                  <Badge variant="info" className="text-xs">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Suppliers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Suppliers</h3>
            <Button variant="outline" size="sm">
              View All Suppliers
            </Button>
          </div>
          
          <div className="space-y-4">
            {topSuppliers.map((supplier, index) => (
              <div key={supplier.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-card hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-secondary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {supplier.companyName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {supplier.totalOrders} orders • {supplier.totalProducts} products
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">
                    ${supplier.totalRevenue.toLocaleString()}
                  </p>
                  <Badge variant={supplier.subscriptionStatus === "active" ? "success" : "warning"} className="text-xs">
                    {supplier.subscriptionStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Platform Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Suppliers</p>
            <p className="text-2xl font-bold text-gray-900">{totalSuppliers}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Active Rate</p>
            <p className="text-2xl font-bold text-success">
              {((activeSuppliers / totalSuppliers) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Order Value</p>
            <p className="text-2xl font-bold text-primary-600">
              ${(totalRevenue / totalOrders).toFixed(0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Commission Rate</p>
            <p className="text-2xl font-bold text-secondary-400">3.0%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;