import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { ProductService } from "@/services/api/productService";
import { OrderService } from "@/services/api/orderService";
import { SupplierService } from "@/services/api/supplierService";

const SupplierDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      
      // In a real app, get supplier ID from auth context
      const supplierId = 1;
      
      const [productsData, ordersData, supplierData] = await Promise.all([
        ProductService.getBySupplierId(supplierId),
        OrderService.getBySupplierId(supplierId),
        SupplierService.getById(supplierId)
      ]);
      
      setProducts(productsData);
      setOrders(ordersData);
      setSupplier(supplierData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalOrders = orders.length;
  const activeProducts = products.filter(p => p.stock > 0).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
            Supplier Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {supplier?.companyInfo?.name || "Supplier"}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant={supplier?.subscriptionStatus === "active" ? "success" : "warning"}>
            {supplier?.subscriptionStatus === "active" ? "Active Subscription" : "Inactive"}
          </Badge>
          <Button variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-success">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-primary-600">
                {totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-3xl font-bold text-secondary-400">
                {activeProducts}
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-secondary-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-warning">
                {lowStockProducts}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-card">
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order.Id.toString().padStart(6, "0")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      ${order.subtotal.toFixed(2)}
                    </p>
                    <Badge variant="info" className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Product Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <Button variant="outline" size="sm">
              Manage Products
            </Button>
          </div>
          
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-card">
                <div className="flex items-center gap-3">
<img
                    src={product.images?.[0] || "https://picsum.photos/50/50"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.stock < 10 && (
                    <Badge variant="warning" className="text-xs mt-1">
                      Low Stock
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Subscription Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Current Plan</p>
            <p className="font-semibold text-gray-900">
              {supplier?.subscriptionTier || "Basic Plan"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Fee</p>
            <p className="font-semibold text-gray-900">$300.00</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Next Billing Date</p>
            <p className="font-semibold text-gray-900">March 15, 2024</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Platform Commission</h4>
              <p className="text-sm text-gray-600">
                3% commission on all sales automatically deducted
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Commission Details
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SupplierDashboardPage;