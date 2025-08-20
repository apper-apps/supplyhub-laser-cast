import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";

const Empty = ({ 
  message = "No items found", 
  description = "Try adjusting your search or filters to find what you're looking for.",
  actionLabel = "Browse Products",
  actionPath = "/catalog" 
}) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Package" className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h3>
        
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        <Button 
          variant="primary" 
          onClick={() => navigate(actionPath)}
          className="min-w-[140px]"
        >
          <ApperIcon name="Search" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};

export default Empty;