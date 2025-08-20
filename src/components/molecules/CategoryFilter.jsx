import { cn } from "@/utils/cn";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
      <div className="space-y-1">
        <button
          onClick={() => onCategoryChange("")}
          className={cn(
            "w-full text-left px-3 py-2 rounded-button text-sm transition-colors",
            selectedCategory === ""
              ? "bg-primary-100 text-primary-700 font-medium"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-button text-sm transition-colors",
              selectedCategory === category
                ? "bg-primary-100 text-primary-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;