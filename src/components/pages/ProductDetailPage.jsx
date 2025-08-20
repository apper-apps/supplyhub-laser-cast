import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { ProductService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const loadProduct = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await ProductService.getById(parseInt(id));
      setProduct(data);
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProduct} />;
  if (!product) return <Error message="Product not found" />;

  const images = product.images || ["/api/placeholder/600/600"];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm">
        <button
          onClick={() => navigate("/catalog")}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Catalog
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">{product.category}</span>
        <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-card overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === index ? "border-primary-600" : "border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="info" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600">
              by {product.supplierName}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500">per unit</span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <ApperIcon 
              name={product.stock > 0 ? "Check" : "X"} 
              className={`w-5 h-5 ${product.stock > 0 ? "text-success" : "text-error"}`} 
            />
            <span className={product.stock > 0 ? "text-success" : "text-error"}>
              {product.stock > 0 ? `${product.stock} units in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity and Actions */}
          {product.stock > 0 && (
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-input w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="Minus" className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-20 text-center border-0 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleBuyNow}
                    className="flex-1"
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  Total: ${(product.price * quantity).toFixed(2)}
                </div>
              </div>
            </Card>
          )}

          {/* Product Description */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description || "No description available."}
            </p>
          </Card>

          {/* Specifications */}
          {product.specifications && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Supplier Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Supplier Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-400 rounded-full flex items-center justify-center">
                <ApperIcon name="Building" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{product.supplierName}</h4>
                <p className="text-sm text-gray-600">Verified Supplier</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;