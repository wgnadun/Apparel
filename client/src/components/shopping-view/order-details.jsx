import React from 'react'
import { DialogContent } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

function ShoppingOrderDetailsView() {
  return (
     <DialogContent className="sm:max-w-[600px]">
        <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="mt-6 flex items-center justify-between">
                    <p className="font-medium">Order ID</p>
                    <Label>123456</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Order Date</p>
                    <Label>2023-02-15</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>$99.99</Label>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">Order Status</p>
                    <Label>Shipped</Label>
                </div>
            </div>
            <Separator/>
              <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span>Product line 1</span>
                                <span>$50</span> 
                            </li>
                        </ul>
                    </div>
              </div>
            <Separator/>
             <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                                <div className="grid gap-0 5 text-muted-foreground">
                                    <span>Nadun Dananjaya</span>
                                    <span>123 Main St, Anytown, USA</span>
                                    <span>matara</span>
                                    <span>Maod8756</span>
                                    <span>074556321</span>
                                    <span>notes</span>
                                </div>
                    </div>

              </div>    

        </div>
    </DialogContent>
  )
}

export default ShoppingOrderDetailsView