import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";

function ShoppingOrders(){

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
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
                            <TableRow>
                                <TableCell>12345</TableCell>
                                <TableCell>2023-02-15</TableCell>
                                <TableCell>Shipped</TableCell>
                                <TableCell>$99.99</TableCell>
                                <TableCell>
                                    <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                                        <Button
                                            onClick={() => setOpenDetailsDialog(true)}
                                        >View Details</Button>
                                        <ShoppingOrderDetailsView />
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
export default ShoppingOrders;