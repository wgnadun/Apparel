import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label';

function AddressCard({addressInfo, handleDeleteAddress, handleEditAddress,setCurrentSelectedAddress}) {
  return (
    <Card onClick={setCurrentSelectedAddress? ()=>setCurrentSelectedAddress(addressInfo):null}>
        <CardContent className="grid p-4 gap-4">
            <Label>Address : {addressInfo?.address}</Label>
            <Label>City : {addressInfo?.city}</Label>
            <Label>Pincode : {addressInfo?.pincode}</Label>
            <Label>Phone : {addressInfo?.phone}</Label>
            <Label>Notes : {addressInfo?.notes}</Label>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button onClick={() => handleEditAddress(addressInfo)} variant="outline">Edit</Button>
            <Button onClick={() => handleDeleteAddress(addressInfo)} variant="destructive">Delete</Button>
        </CardFooter>
    </Card>
  );
}

export default AddressCard;