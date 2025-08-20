import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";

const ProductCard = ({ product, className }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleProductClick = () => {
    navigate(`/product/${product.Id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleQuantityChange = (e) => {
    e.stopPropagation();
    setQuantity(parseInt(e.target.value) || 1);
  };

  return (
    <Card 
      hover 
      className={cn(
        "overflow-hidden cursor-pointer group",
        className
      )}
      onClick={handleProductClick}
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={product.images?.[0] || "/api/placeholder/300/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 10 && (
          <Badge 
            variant="warning" 
            className="absolute top-2 right-2"
          >
            Low Stock
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <Badge variant="info" className="text-xs">
            {product.category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          by {product.supplierName}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 ml-1">per unit</span>
          </div>
          <div className="text-sm text-gray-600">
            Stock: {product.stock}
          </div>
        </div>
        
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center border border-gray-300 rounded-input">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 text-center border-0 focus:outline-none"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.min(product.stock, quantity + 1));
              }}
              className="px-2 py-1 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </button>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="flex-1"
            disabled={product.stock === 0}
          >
            <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;