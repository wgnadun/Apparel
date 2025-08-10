import React from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableRow } from '../ui/table'
import { Calendar, ClipboardCheck, CreditCard, DollarSign, Receipt, Truck } from 'lucide-react'

function ShoppingOrderDetailsView({orderDetails}) {
 
 const {user} =  useSelector(state => state.auth)

  return (
     <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
    <div className="font-medium">Order Details</div>

        <div className="grid gap-6">
           <div className="mt-6">
                <Table className="border rounded-md">
                    <TableBody>
                    <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                        <Receipt
                         size={16} /> Order ID
                        </TableCell>
                        <TableCell>
                        <Label>{orderDetails?._id}</Label>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                        <Calendar size={16} /> Order Date
                        </TableCell>
                        <TableCell>
                        <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                        <DollarSign size={16} /> Order Price
                        </TableCell>
                        <TableCell>
                        <Label>${orderDetails?.totalAmount}</Label>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                        <CreditCard size={16} /> Payment Method
                        </TableCell>
                        <TableCell>
                        <Label>{orderDetails?.paymentMethod}</Label>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                        <ClipboardCheck size={16} /> Payment Status
                        </TableCell>
                        <TableCell>
                        <Label>{orderDetails?.paymentStatus}</Label>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium flex items-center gap-2">
                        <Truck size={16} /> Order Status
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
                </div>
            <Separator/>
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

        </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetailsView