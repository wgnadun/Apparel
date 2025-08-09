import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-blue-400 ${
        selectedId?._id === addressInfo?._id
          ? "border-b-blue-600 border-x-blue-600 border-[2px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
                  <div className="space-y-2 max-w-md">
              <div className="flex">
                <span className="w-28 font-medium">Address</span>
                <span className="mr-1">:</span>
                <span>{addressInfo?.address}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-medium">City</span>
                <span className="mr-1">:</span>
                <span>{addressInfo?.city}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-medium">Postal code</span>
                <span className="mr-1">:</span>
                <span>{addressInfo?.pincode}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-medium">Phone</span>
                <span className="mr-1">:</span>
                <span>{addressInfo?.phone}</span>
              </div>
              <div className="flex">
                <span className="w-28 font-medium">Notes</span>
                <span className="mr-1">:</span>
                <span>{addressInfo?.notes}</span>
              </div>
            </div>

      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;