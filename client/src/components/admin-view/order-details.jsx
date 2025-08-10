import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";

function AdminOrderDetailsView({ orderDetails }) {
  const initialFormData = {
    status: "",
  };

  const [formData, setFromData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllOrdersForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFromData(initialFormData);
        toast.success("Order Status Updated Successfully !");
      }
    });
  }

  return (
  <DialogContent className="m:max-w-[600px] max-h-[80vh] overflow-y-auto">
  <div className="grid gap-6">
    {/* Order Info */}
    <div className="grid gap-2">
      {[
        { label: "Order ID", value: orderDetails?._id },
        { label: "Order Date", value: orderDetails?.orderDate.split("T")[0] },
        { label: "Order Price", value: `$${orderDetails?.totalAmount}` },
        { label: "Payment Method", value: orderDetails?.paymentMethod },
        { label: "Payment Status", value: orderDetails?.paymentStatus },
      ].map((item, idx) => (
        <div
          key={idx}
          className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0"
        >
          <p className="font-medium text-sm sm:text-base">{item.label}</p>
          <Label className="break-words whitespace-normal text-sm sm:text-base">
            {item.value}
          </Label>
        </div>
      ))}

      {/* Order Status */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
        <p className="font-medium text-sm sm:text-base">Order Status</p>
        <Label className="break-words whitespace-normal">
          <Badge
            className={`py-1 px-3 text-xs sm:text-sm ${
              orderDetails?.orderStatus === "confirmed"
                ? "bg-green-700"
                : orderDetails?.orderStatus === "Rejected"
                ? "bg-red-600"
                : "bg-black"
            }`}
          >
            {orderDetails?.orderStatus}
          </Badge>
        </Label>
      </div>
    </div>

    <Separator />

    {/* Order Details */}
                 <div className="grid gap-4">
  <div className="grid gap-2">
    <div className="overflow-x-auto">
      <table className="min-w-[500px] w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2 text-left">Product</th>
            <th className="border border-gray-300 p-2 text-center">Quantity</th>
            <th className="border border-gray-300 p-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails?.cartItems?.length > 0 &&
            orderDetails.cartItems.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2 whitespace-normal break-words max-w-[200px]">
                  {item.title}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  ${item.price}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
</div>


    <Separator />

    {/* Shipping Info */}
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="font-medium">Shipping Info</div>
        <div className="grid gap-0.5 text-muted-foreground break-words whitespace-normal text-sm sm:text-base">
          <span>{user.userName}</span>
          <span>{orderDetails?.addressInfo?.address}</span>
          <span>{orderDetails?.addressInfo?.city}</span>
          <span>{orderDetails?.addressInfo?.pincode}</span>
          <span>{orderDetails?.addressInfo?.phone}</span>
          <span>{orderDetails?.addressInfo?.notes}</span>
        </div>
      </div>
    </div>

    {/* Update Status Form */}
    <CommonForm
      formControls={[
        {
          label: "Order Status",
          name: "status",
          componentType: "select",
          options: [
            { id: "Pending", label: "Pending" },
            { id: "In Processing", label: "In Processing" },
            { id: "In Shipping", label: "In Shipping" },
            { id: "Delivered", label: "Delivered" },
            { id: "Rejected", label: "Rejected" },
          ],
        },
      ]}
      formData={formData}
      setFormData={setFromData}
      buttonText="Update Order Status"
      onSubmit={handleUpdateStatus}
    />
  </div>
</DialogContent>

  );
}

export default AdminOrderDetailsView;
