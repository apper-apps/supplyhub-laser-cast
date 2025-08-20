import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const OrderSummary = ({ items = [], className }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const commission = subtotal * 0.03; // 3% commission
  const total = subtotal + commission;

  return (
    <Card className={cn("p-6", className)}>
      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.product.Id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform Fee (3%)</span>
          <span className="font-medium">${commission.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-2">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-primary-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderSummary;