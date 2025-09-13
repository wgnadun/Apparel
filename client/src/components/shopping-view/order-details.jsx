import React from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableRow } from '../ui/table'
import { Calendar, ClipboardCheck, CreditCard, DollarSign, Receipt, Truck } from 'lucide-react'

function ShoppingOrderDetailsView({orderDetails}) {
 
 const {user} =  useSelector(state => state.auth)

  return (
     <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden bg-white">
    <DialogTitle className="sr-only">Order Details</DialogTitle>
    
    {/* Header */}
    <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-bold text-black">Order Details</h2>
        <Badge
          className={`py-2 px-4 text-sm font-semibold rounded-full ${
            orderDetails?.orderStatus === "confirmed"
              ? "bg-black text-white"
              : orderDetails?.orderStatus === "Rejected"
              ? "bg-gray-400 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {orderDetails?.orderStatus}
        </Badge>
      </div>
      <p className="text-gray-600">Order #{orderDetails?._id?.slice(-8)}</p>
    </div>

    {/* Order Information */}
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
          <Receipt size={20} className="text-gray-600" />
          Order Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date</span>
            <span className="font-medium text-black">{orderDetails?.orderDate.split("T")[0]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium text-black">{orderDetails?.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status</span>
            <span className="font-medium text-black">{orderDetails?.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black flex items-center gap-2">
          <Truck size={20} className="text-gray-600" />
          Shipping Address
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-1 text-sm">
            <div className="font-semibold text-black">{user.userName}</div>
            <div className="text-gray-700">{orderDetails?.addressInfo?.address}</div>
            <div className="text-gray-700">{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</div>
            <div className="text-gray-700 font-medium">{orderDetails?.addressInfo?.phone}</div>
            {orderDetails?.addressInfo?.notes && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">Notes:</div>
                <div className="text-gray-700">{orderDetails?.addressInfo?.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Order Items */}
    <div>
      <h3 className="text-lg font-semibold text-black mb-4">Order Items</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Price</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {orderDetails?.cartItems?.length > 0 &&
                orderDetails.cartItems.map((item, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="font-medium text-black">{item.title}</div>
                      <div className="text-center text-gray-700">{item.quantity}</div>
                      <div className="text-right">
                        <div className="font-semibold text-black">${item.price}</div>
                        <div className="text-xs text-gray-500">${(item.price * item.quantity).toFixed(2)} total</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total Amount</span>
                <span>${orderDetails?.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetailsView