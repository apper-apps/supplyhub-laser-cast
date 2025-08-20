import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const PriceFilter = ({ onPriceChange, className }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApplyFilter = () => {
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    onPriceChange(min, max);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    onPriceChange(null, null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-gray-900">Price Range</h3>
      
      <div className="space-y-3">
        <FormField
          label="Min Price"
          type="number"
          placeholder="$0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
          step="0.01"
        />
        
        <FormField
          label="Max Price"
          type="number"
          placeholder="$1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
          step="0.01"
        />
        
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleApplyFilter}
            className="flex-1"
          >
            Apply
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;