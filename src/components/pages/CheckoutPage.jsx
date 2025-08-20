import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import OrderSummary from "@/components/molecules/OrderSummary";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { OrderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shippingInfo, setShippingInfo] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const commission = subtotal * 0.03;
  const total = subtotal + commission;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.Id,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal,
        commission,
        total,
        shippingInfo,
        paymentInfo: {
          last4: paymentInfo.cardNumber.slice(-4),
          cardholderName: paymentInfo.cardholderName
        }
      };

      const order = await OrderService.create(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping Information", completed: currentStep > 1 },
    { number: 2, title: "Payment Information", completed: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-400 bg-clip-text text-transparent">
          Checkout
        </h1>
        <p className="text-gray-600 mt-1">Complete your order securely</p>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.number === currentStep 
                  ? "border-primary-600 bg-primary-600 text-white"
                  : step.completed
                  ? "border-success bg-success text-white"
                  : "border-gray-300 text-gray-400"
              }`}>
                {step.completed ? (
                  <ApperIcon name="Check" className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <span className={`ml-3 font-medium ${
                step.number === currentStep ? "text-primary-600" : "text-gray-500"
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`mx-8 h-0.5 w-16 ${
                  step.completed ? "bg-success" : "bg-gray-300"
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Company Name"
                    required
                    value={shippingInfo.companyName}
                    onChange={(e) => setShippingInfo(prev => ({...prev, companyName: e.target.value}))}
                  />
                  <FormField
                    label="Contact Name"
                    required
                    value={shippingInfo.contactName}
                    onChange={(e) => setShippingInfo(prev => ({...prev, contactName: e.target.value}))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Email Address"
                    type="email"
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo(prev => ({...prev, email: e.target.value}))}
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    required
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo(prev => ({...prev, phone: e.target.value}))}
                  />
                </div>

                <FormField
                  label="Street Address"
                  required
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo(prev => ({...prev, address: e.target.value}))}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="City"
                    required
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo(prev => ({...prev, city: e.target.value}))}
                  />
                  <FormField
                    label="State/Province"
                    required
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo(prev => ({...prev, state: e.target.value}))}
                  />
                  <FormField
                    label="ZIP/Postal Code"
                    required
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo(prev => ({...prev, zipCode: e.target.value}))}
                  />
                </div>

                <FormField
                  label="Country"
                  required
                  value={shippingInfo.country}
                  onChange={(e) => setShippingInfo(prev => ({...prev, country: e.target.value}))}
                />

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Information
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(1)}
                  className="text-primary-600"
                >
                  <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <FormField
                  label="Cardholder Name"
                  required
                  value={paymentInfo.cardholderName}
                  onChange={(e) => setPaymentInfo(prev => ({...prev, cardholderName: e.target.value}))}
                />

                <FormField
                  label="Card Number"
                  required
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo(prev => ({...prev, cardNumber: e.target.value}))}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Expiry Date"
                    required
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => setPaymentInfo(prev => ({...prev, expiryDate: e.target.value}))}
                  />
                  <FormField
                    label="CVV"
                    required
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo(prev => ({...prev, cvv: e.target.value}))}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-card">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Shield" className="w-4 h-4 text-success" />
                    Your payment information is encrypted and secure
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" className="w-4 h-4 mr-2" />
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <OrderSummary items={cartItems} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;