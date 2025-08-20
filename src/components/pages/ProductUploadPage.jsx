import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import { ProductService } from "@/services/api/productService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const ProductUploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    supplierName: "Current Supplier", // This would come from auth context
    supplierId: 1, // This would come from auth context
    imageUrl: "",
    stockQuantity: "",
    specifications: "",
    minimumOrderQuantity: "1"
  });
  const [errors, setErrors] = useState({});

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Toys",
    "Health & Beauty",
    "Automotive",
    "Food & Beverages",
    "Office Supplies"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImagePreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          imageUrl: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ""
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.stockQuantity || isNaN(formData.stockQuantity) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = "Valid stock quantity is required";
    }
    
    if (!formData.minimumOrderQuantity || isNaN(formData.minimumOrderQuantity) || parseInt(formData.minimumOrderQuantity) < 1) {
      newErrors.minimumOrderQuantity = "Minimum order quantity must be at least 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        minimumOrderQuantity: parseInt(formData.minimumOrderQuantity),
        status: "active",
        rating: 0,
        reviewCount: 0
      };
      
      await ProductService.create(productData);
      toast.success("Product uploaded successfully!");
      navigate("/supplier-dashboard");
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error("Failed to upload product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/supplier-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate("/supplier-dashboard")}
            >
              <ApperIcon name="ArrowLeft" size={16} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upload Product</h1>
              <p className="text-gray-600">Add a new product to your catalog</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Product Information */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ApperIcon name="Package" size={20} />
                  Product Information
                </h2>
                
                <div className="space-y-4">
                  <FormField
                    label="Product Name"
                    error={errors.name}
                    required
                  >
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                  </FormField>
                  
                  <FormField
                    label="Description"
                    error={errors.description}
                    required
                  >
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your product..."
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-input",
                        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                        "resize-none",
                        errors.description ? "border-red-500" : ""
                      )}
                    />
                  </FormField>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Price ($)"
                      error={errors.price}
                      required
                    >
                      <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={errors.price ? "border-red-500" : ""}
                      />
                    </FormField>
                    
                    <FormField
                      label="Category"
                      error={errors.category}
                      required
                    >
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={cn(
                          "w-full px-3 py-2 border border-gray-300 rounded-input",
                          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                          errors.category ? "border-red-500" : ""
                        )}
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ApperIcon name="Settings" size={20} />
                  Inventory & Specifications
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Stock Quantity"
                      error={errors.stockQuantity}
                      required
                    >
                      <Input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className={errors.stockQuantity ? "border-red-500" : ""}
                      />
                    </FormField>
                    
                    <FormField
                      label="Minimum Order"
                      error={errors.minimumOrderQuantity}
                      required
                    >
                      <Input
                        type="number"
                        name="minimumOrderQuantity"
                        value={formData.minimumOrderQuantity}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                        className={errors.minimumOrderQuantity ? "border-red-500" : ""}
                      />
                    </FormField>
                  </div>
                  
                  <FormField
                    label="Specifications"
                  >
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Technical specifications, dimensions, materials, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-input focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                  </FormField>
                </div>
              </Card>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ApperIcon name="Image" size={20} />
                  Product Image
                </h2>
                
                <div className="space-y-4">
                  {!imagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
                    >
                      <ApperIcon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload product image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <ApperIcon name="X" size={16} />
                      </Button>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <ApperIcon name="Upload" size={16} className="mr-2" />
                      Change Image
                    </Button>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Upload" size={16} className="mr-2" />
                        Upload Product
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUploadPage;