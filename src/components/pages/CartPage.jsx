import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import CartItem from "@/components/molecules/CartItem";
import OrderSummary from "@/components/molecules/OrderSummary";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <ApperIcon name="ShoppingCart" className="w-16 h-16 text-gray-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/catalog")}
          size="lg"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        <Button
          variant="outline"
          onClick={clearCart}
          className="text-error hover:text-red-700 hover:border-red-300"
        >
          <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.product.Id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <OrderSummary items={cartItems} />
          
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => navigate("/checkout")}
              className="w-full"
              size="lg"
            >
              Proceed to Checkout
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/catalog")}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Security Info */}
          <Card className="p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ApperIcon name="Shield" className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium">Secure Checkout</p>
                <p>Your payment information is protected</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;