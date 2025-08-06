import React, { useState } from 'react'
import { DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import CommonForm from '../common/form';
import { Badge } from '../ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersForAdmin, updateOrderStatus } from '@/store/admin/order-slice';
import { toast } from 'sonner';

function AdminOrderDetailsView({orderDetails}) {
    const initialFormData = {
        status: ""
    }

const [formData, setFromData]= useState(initialFormData);
const {user} = useSelector(state=> state.auth);

const dispatch = useDispatch();

   
function handleUpdateStatus(event) {
        event.preventDefault();
        const {status} = formData;

        dispatch(updateOrderStatus({id : orderDetails?._id,orderStatus : status})
    ).then(data=>{
            if(data?.payload?.success){
                dispatch(getAllOrdersForAdmin(orderDetails?._id));
                dispatch(getAllOrdersForAdmin())
                setFromData(initialFormData);
                toast.success('Order Status Updated Successfully !');
            }
            
        })
}

  return (
    <DialogContent className="sm:max-w-[600px]">
        <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="mt-6 flex items-center justify-between">
                    <p className="font-medium">Order ID</p>
                    <Label>{orderDetails?._id}</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Order Date</p>
                    <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>${orderDetails?.totalAmount}</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Payment method</p>
                    <Label>{orderDetails?.paymentMethod}</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Payment Status</p>
                    <Label>{orderDetails?.paymentStatus}</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Order Status</p>
                    <Label>
                        <Badge
                            className={`py-1 px-3 ${
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
            <Separator/>
                 <div className="grid gap-4">
                       <div className="grid gap-2">
                           <div className="font-medium">Order Details</div>
                           <ul className="grid gap-3">
                               {
                                   orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?
                                   orderDetails?.cartItems.map(item=>
                               <li className="flex items-center justify-between">
                                   <span>{item.title}</span>
                                   <span>X{item.quantity}</span>
                                   <span>${item.price}</span> 
                               </li>
                                   ) : null
                               }
                             
                           </ul>
                       </div>
                 </div>
               <Separator/>
                <div className="grid gap-4">
                       <div className="grid gap-2">
                           <div className="font-medium">Shipping Info</div>
                                   <div className="grid gap-0 5 text-muted-foreground">
                                       <span>{user.userName}</span>
                                       <span>{orderDetails?.addressInfo?.address}</span>
                                       <span>{orderDetails?.addressInfo?.city}</span>
                                       <span>{orderDetails?.addressInfo?.pincode}</span>
                                       <span>{orderDetails?.addressInfo?.phone}</span>
                                       <span>{orderDetails?.addressInfo?.notes}</span>
                                   </div>
                       </div>
   
                 </div>    
     

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
                            { id: "Rejected", label: "Rejected" }
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
  )
}

export default AdminOrderDetailsView;
