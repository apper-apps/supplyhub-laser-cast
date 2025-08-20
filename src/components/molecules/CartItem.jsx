import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateQuantity(item.product.Id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.product.Id);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-card">
      <img
        src={item.product.images?.[0] || "/api/placeholder/80/80"}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {item.product.name}
        </h4>
        <p className="text-sm text-gray-600">
          by {item.product.supplierName}
        </p>
        <p className="text-sm font-medium text-primary-600">
          ${item.product.price.toFixed(2)} per unit
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-gray-300 rounded-input">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="px-2 py-1 hover:bg-gray-100 transition-colors"
            disabled={quantity <= 1}
          >
            <ApperIcon name="Minus" className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="px-2 py-1 hover:bg-gray-100 transition-colors"
            disabled={quantity >= item.product.stock}
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-right min-w-[5rem]">
          <div className="font-semibold text-gray-900">
            ${(item.product.price * quantity).toFixed(2)}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="text-error hover:text-red-700 hover:bg-red-50"
        >
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;