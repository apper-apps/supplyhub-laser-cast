import Card from "@/components/atoms/Card";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import PriceFilter from "@/components/molecules/PriceFilter";

const FilterSidebar = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  onPriceChange,
  className 
}) => {
  return (
    <div className={className}>
      <Card className="p-6 mb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </Card>

      <Card className="p-6">
        <PriceFilter onPriceChange={onPriceChange} />
      </Card>
    </div>
  );
};

export default FilterSidebar;