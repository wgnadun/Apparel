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
    <div
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer bg-white border-2 rounded-lg transition-all duration-300 hover:shadow-lg ${
        selectedId?._id === addressInfo?._id
          ? "border-black shadow-lg"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
        <div className="p-6">
            <div className="space-y-3">
              {[
                { label: "Address", value: addressInfo?.address },
                { label: "City", value: addressInfo?.city },
                { label: "Postal Code", value: addressInfo?.pincode },
                { label: "Phone", value: addressInfo?.phone },
                { label: "Notes", value: addressInfo?.notes },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start">
                  <span className="w-full sm:w-28 font-semibold text-gray-700 flex-shrink-0 mb-1 sm:mb-0">
                    {label}:
                  </span>
                  <span className="break-words flex-grow w-full text-black">{value || 'N/A'}</span>
                </div>
              ))}
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleEditAddress(addressInfo);
            }}
            className="bg-white hover:bg-gray-100 text-black border border-gray-300 hover:border-gray-400"
          >
            Edit
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAddress(addressInfo);
            }}
            className="bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300"
          >
            Delete
          </Button>
        </div>
    </div>
  );
}

export default AddressCard;