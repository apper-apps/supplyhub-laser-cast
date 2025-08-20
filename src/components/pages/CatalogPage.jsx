import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { ProductService } from "@/services/api/productService";

const CatalogPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  const loadProducts = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplierName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    if (priceRange.min !== null || priceRange.max !== null) {
      filtered = filtered.filter(product => {
        const price = product.price;
        const minCheck = priceRange.min === null || price >= priceRange.min;
        const maxCheck = priceRange.max === null || price <= priceRange.max;
        return minCheck && maxCheck;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy, priceRange]);

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setPriceRange({ min: null, max: null });
    setSortBy("name");
  };

  const hasActiveFilters = selectedCategory || searchQuery || priceRange.min !== null || priceRange.max !== null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
            Product Catalog
          </h1>
          <p className="text-gray-600 mt-1">
            Discover quality products from verified suppliers
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden"
        >
          <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {filteredProducts.length} products found
          </span>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700"
            >
              <ApperIcon name="X" className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-input px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onPriceChange={handlePriceChange}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            onRetry={loadProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;