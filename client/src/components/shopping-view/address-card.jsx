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
        <CardContent className="p-4">
            <div className="space-y-3 max-w-md w-full overflow-x-hidden">
              {[
                { label: "Address", value: addressInfo?.address },
                { label: "City", value: addressInfo?.city },
                { label: "Postal code", value: addressInfo?.pincode },
                { label: "Phone", value: addressInfo?.phone },
                { label: "Notes", value: addressInfo?.notes },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start">
                  <span className="w-full sm:w-28 font-medium flex-shrink-0 mb-1 sm:mb-0">
                    {label}:
                  </span>
                  <span className="break-words flex-grow w-full">{value}</span>
                </div>
              ))}
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