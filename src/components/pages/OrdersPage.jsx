import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { OrderService } from "@/services/api/orderService";
import { format } from "date-fns";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadOrders = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await OrderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = selectedStatus 
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "processing": return "info";
      case "shipped": return "primary";
      case "delivered": return "success";
      default: return "default";
    }
  };

  const statusOptions = [
    { value: "", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOrders} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Empty message="No orders found" />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.Id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.Id.toString().padStart(6, "0")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-card">
                      <img
                        src={item.image || "/api/placeholder/60/60"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex gap-6">
                    <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                    <span>Commission: ${order.commission.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {order.status === "shipped" && (
                      <Button variant="primary" size="sm">
                        <ApperIcon name="Truck" className="w-4 h-4 mr-1" />
                        Track Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;