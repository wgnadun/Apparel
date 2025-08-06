import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId } from "@/store/shop/order-slice";

function ShoppingOrders(){

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const {orderList} = useSelector(state => state.shopOrder);

    useEffect(()=>{
        dispatch(getAllOrdersByUserId(user?.id))
    },[dispatch]);

    console.log(orderList,'order List');

    return(
        <Card>
            <CardHeader>
                <CardTitle className="text-left font-bold text-lg">Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Order ID</TableHead>
                            <TableHead className="text-center">Order Date</TableHead>
                            <TableHead className="text-center">Order Status</TableHead>
                            <TableHead className="text-center">Order Price</TableHead>
                            <TableHead className="text-center">
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                        <TableBody>
                            {
                                orderList && orderList.length > 0 ?
                                orderList.map(orderItem =>      <TableRow>
                                <TableCell>{orderItem?._id}</TableCell>
                                <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                <TableCell>{orderItem?.orderStatus}</TableCell>
                                <TableCell>{orderItem?.totalAmount}</TableCell>
                                <TableCell>
                                    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                                        <Button
                                            onClick={() => setOpenDetailsDialog(true)}
                                        >View Details</Button>
                                        <ShoppingOrderDetailsView />
                                    </Dialog>
                                </TableCell>
                            </TableRow> ) :null
                            }
                      
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
export default ShoppingOrders;