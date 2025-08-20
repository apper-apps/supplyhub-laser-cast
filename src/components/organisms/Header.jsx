import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/utils/cn";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user role - in real app, get from auth context
  const userRole = location.pathname.includes("admin") ? "admin" 
                  : location.pathname.includes("supplier") ? "supplier" 
                  : "buyer";

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
    }
  };

  const navItems = [
{ label: "Catalog", path: "/catalog", roles: ["buyer", "supplier", "admin"] },
    { label: "Orders", path: "/orders", roles: ["buyer", "supplier", "admin"] },
    { label: "Supplier Dashboard", path: "/supplier-dashboard", roles: ["supplier"] },
    { label: "Upload Products", path: "/upload-products", roles: ["supplier"] },
    { label: "Admin Dashboard", path: "/admin-dashboard", roles: ["admin"] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-400 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Package" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
              SupplyHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-600",
                  location.pathname === item.path
                    ? "text-primary-600 border-b-2 border-primary-600 pb-1"
                    : "text-gray-700"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              placeholder="Search products..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {userRole === "buyer" && (
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ApperIcon name="ShoppingCart" className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="error"
                    className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs font-bold"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </button>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <Badge variant="info" className="capitalize">
                {userRole}
              </Badge>
              <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ApperIcon name="User" className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden pb-3">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {filteredNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "block w-full text-left px-3 py-2 rounded-button text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;