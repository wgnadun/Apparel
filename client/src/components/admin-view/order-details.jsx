import React, { useState, useMemo, useEffect } from "react";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";
import { useAuth0 } from '@auth0/auth0-react';
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Truck,
  ShoppingBag,
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Add custom styles for dialog overlay with blur effect
const dialogOverlayStyles = `
  [data-radix-dialog-overlay] {
    background-color: rgba(0, 0, 0, 0.3) !important;
    backdrop-filter: blur(50px) !important;
    -webkit-backdrop-filter: blur(50px) !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = dialogOverlayStyles;
  if (!document.head.querySelector('style[data-dialog-overlay-remove]')) {
    styleSheet.setAttribute('data-dialog-overlay-remove', 'true');
    document.head.appendChild(styleSheet);
  }
}

function AdminOrderDetailsView({ orderDetails }) {
  const initialFormData = {
    status: orderDetails?.orderStatus || "pending",
  };

  const [formData, setFromData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { user, authType } = useSelector((state) => state.auth);
  const { getAccessTokenSilently } = useAuth0();

  const dispatch = useDispatch();

  // Update form data when orderDetails changes
  useEffect(() => {
    if (orderDetails?.orderStatus) {
      setFromData({
        status: orderDetails.orderStatus
      });
    }
  }, [orderDetails?.orderStatus]);

  // Memoize expensive calculations
  const orderSummary = useMemo(() => {
    if (!orderDetails) return null;
    
    return {
      formattedDate: new Date(orderDetails.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      totalAmount: orderDetails.totalAmount?.toFixed(2),
      itemCount: orderDetails.cartItems?.length || 0,
      orderId: orderDetails._id?.slice(-8)
    };
  }, [orderDetails]);

  // Memoize cart items with totals
  const cartItemsWithTotals = useMemo(() => {
    if (!orderDetails?.cartItems) return [];
    
    return orderDetails.cartItems.map(item => ({
      ...item,
      total: (item.price * item.quantity).toFixed(2)
    }));
  }, [orderDetails?.cartItems]);

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return { 
          icon: CheckCircle, 
          color: 'bg-emerald-500', 
          bgColor: 'bg-emerald-50', 
          textColor: 'text-emerald-700',
          borderColor: 'border-emerald-200'
        };
      case 'rejected':
        return { 
          icon: XCircle, 
          color: 'bg-red-500', 
          bgColor: 'bg-red-50', 
          textColor: 'text-red-700',
          borderColor: 'border-red-200'
        };
      case 'pending':
        return { 
          icon: Clock, 
          color: 'bg-amber-500', 
          bgColor: 'bg-amber-50', 
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200'
        };
      default:
        return { 
          icon: AlertCircle, 
          color: 'bg-blue-500', 
          bgColor: 'bg-blue-50', 
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
    }
  };

  function handleUpdateStatus(event) {
    event.preventDefault();
    setIsLoading(true);
    const { status } = formData;
    
    console.log("Updating order status:", { 
      orderId: orderDetails?._id, 
      status, 
      formData 
    });

    const authParams = { getAccessTokenSilently, authType };

    dispatch(
      updateOrderStatus({ 
        id: orderDetails?._id, 
        orderStatus: status,
        ...authParams
      })
    ).then((data) => {
      console.log("Update order status response:", data);
      if (data?.payload?.success) {
        dispatch(getAllOrdersForAdmin({ ...authParams }));
        setFromData({ status: orderDetails?.orderStatus || "pending" });
        toast.success("Order Status Updated Successfully !");
      } else {
        console.error("Update failed:", data?.payload);
        toast.error("Failed to update order status");
      }
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
      setIsLoading(false);
    });
  }

  return (
     <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-hidden bg-white/100 backdrop-blur-md">
    <DialogTitle className="sr-only">Order Details</DialogTitle>
    
     {/* Header with Status */}
     <div className="bg-black text-white p-4 rounded-t-lg -m-6 mb-6">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-xl font-bold">Order Details</h2>
           <p className="text-gray-300 text-sm">Order #{orderDetails?._id?.slice(-8)}</p>
         </div>
         <div className="flex items-center gap-4">
           <div className="text-right">
             <div className="text-2xl font-bold">${orderDetails?.totalAmount}</div>
             <div className="text-gray-300 text-sm">Total Amount</div>
           </div>
           <Badge
             className={`py-2 px-4 text-sm font-semibold rounded-full ${
               orderDetails?.orderStatus === "confirmed"
                 ? "bg-green-600 text-white"
                 : orderDetails?.orderStatus === "Rejected"
                 ? "bg-red-600 text-white"
                 : "bg-yellow-600 text-white"
             }`}
           >
             {orderDetails?.orderStatus}
           </Badge>
         </div>
       </div>
     </div>

    {/* Main Content Grid */}
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column - Order Info & Address */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Information Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-black flex items-center gap-2 mb-4">
            <Receipt size={20} className="text-gray-600" />
            Order Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Order Date</span>
                <span className="font-medium text-black text-sm">{orderDetails?.orderDate.split("T")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Payment Method</span>
                <span className="font-medium text-black text-sm">{orderDetails?.paymentMethod}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Payment Status</span>
                <span className="font-medium text-black text-sm">{orderDetails?.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Amount</span>
                <span className="font-bold text-black text-sm">${orderDetails?.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h3 className="text-base font-semibold text-black flex items-center gap-2 mb-3">
            <Truck size={16} className="text-gray-600" />
            Shipping Address
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-black">{user.userName}</div>
                <div className="text-gray-700">{orderDetails?.addressInfo?.address}</div>
                <div className="text-gray-700">{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</div>
                <div className="text-gray-700 font-medium">{orderDetails?.addressInfo?.phone}</div>
              </div>
              {orderDetails?.addressInfo?.notes && (
                <div className="space-y-1 text-xs">
                  <div className="text-xs text-gray-500 font-medium">Notes:</div>
                  <div className="text-gray-700">{orderDetails?.addressInfo?.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Status Update */}
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-black mb-4">Update Status</h3>
          <div className="space-y-4">
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "confirmed", label: "Confirmed" },
                    { id: "shipped", label: "Shipped" },
                    { id: "delivered", label: "Delivered" },
                    { id: "cancelled", label: "Cancelled" },
                    { id: "Rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFromData}
              buttonText="Update Status"
              onSubmit={handleUpdateStatus}
              isBtnDisabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Order Items - Full Width */}
    <div className="mt-4">
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h3 className="text-base font-semibold text-black flex items-center gap-2 mb-3">
          <Package size={16} className="text-gray-600" />
          Order Items
        </h3>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-700">
                <div>Product</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Unit Price</div>
                <div className="text-right">Total</div>
              </div>
            </div>
            <div className={`divide-y divide-gray-200 ${orderDetails?.cartItems?.length > 4 ? 'max-h-48 overflow-y-auto' : ''}`}>
              {orderDetails?.cartItems?.length > 0 &&
                orderDetails.cartItems.map((item, index) => (
                  <div key={index} className="px-3 py-2 hover:bg-gray-50">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="font-medium text-black text-sm">{item.title}</div>
                      <div className="text-center text-gray-700 text-sm">{item.quantity}</div>
                      <div className="text-right font-semibold text-black text-sm">${item.price}</div>
                      <div className="text-right font-bold text-black text-sm">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    </DialogContent>

  );
}

export default AdminOrderDetailsView;
