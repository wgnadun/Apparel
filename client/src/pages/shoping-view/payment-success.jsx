import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Package } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-8 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-300 text-lg">Your order has been confirmed and will be processed shortly.</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-black mb-4">Thank you for your purchase!</h2>
              <p className="text-gray-600 leading-relaxed">
                We've received your payment and your order is being prepared for shipment. 
                You'll receive a confirmation email with tracking details soon.
              </p>
            </div>

            {/* Order Details Preview */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-black">What's Next?</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span>Order confirmation sent to your email</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span>Items being prepared for shipment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span>Tracking information will be provided</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/shop/account")}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                View Orders
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => navigate("/shop/home")}
                variant="outline"
                className="flex-1 border-black text-black hover:bg-black hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? <span className="text-black font-medium cursor-pointer hover:underline">Contact our support team</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;