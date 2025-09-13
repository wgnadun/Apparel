import ValidatedForm from '@/components/common/validated-form'
import AddressCard from '@/components/shopping-view/address-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addressFormControls } from '@/config'
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { addressSchema } from '@/utils/validation'

const initialAddressFormData ={
    address:'',
    city:'',
    phone:'',
    pincode:'',
    notes: ''
}

function Address({setCurrentSelectedAddress, selectedId}) {
    
    const [formData,setFormData] =  useState(initialAddressFormData)
    const [currentEditedId, setCurrentEditeddId] = useState(null);
    const dispatch = useDispatch();
    const {user} =useSelector((state)=>state.auth);
    const {addressList} =useSelector((state)=>state.shopAddress);
   

 function handleManageAddress(formData){
        if(addressList.length >= 3 && currentEditedId === null){
            toast.error('You can only have up to 3 addresses',{
                style: {
                    backgroundColor: 'white',
                    color: '#8B0000', // Dark red color
                },
            });
            return;
        }
        currentEditedId !==null ? dispatch(editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setCurrentEditeddId(null);
                setFormData(initialAddressFormData);
                toast.success('Address updated successfully', {
                    style: {
                        backgroundColor: 'white',
                        color: 'black',
                    },
                });
            } else {
                toast.error('Failed to update address',{
                    style: {
                        backgroundColor: 'white',
                        color: 'red',
                    },
                });
            }
        }).catch((error) => {
            console.error('Edit address error:', error);
            toast.error('Failed to update address',{
                style: {
                    backgroundColor: 'white',
                    color: 'red',
                },
            });
        })
    :dispatch(addNewAddress({...formData,userId:user?.id})
    
    ).then((data)=>{
        if(data?.payload?.success){
            dispatch(fetchAllAddresses(user?.id))
            console.log('Address: Clearing form data', initialAddressFormData);
            setFormData(initialAddressFormData);
            toast.success('Address added successfully',{
                style: {
                    backgroundColor: 'white',
                    color: 'green',
                },
            });
        } else {
            toast.error('Failed to add address',{
                style: {
                    backgroundColor: 'white',
                    color: 'red',
                },
            });
        }
    }).catch((error) => {
        console.error('Add address error:', error);
        toast.error('Failed to add address',{
            style: {
                backgroundColor: 'white',
                color: 'red',
            },
        });
    }) 
}

function handleDeleteAddress(getCurrentAddress){
  console.log(getCurrentAddress);
  dispatch(deleteAddress({userId: user?.id, addressId: getCurrentAddress?._id})).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchAllAddresses(user?.id))
        toast.success('Address deleted successfully',{
            style: {
                backgroundColor: 'white',
                color: '#8B0000', // Dark red color
            },
        });
      }
  })
}

function handleEditAddress(getCurrentAddress){
    setCurrentEditeddId(getCurrentAddress?._id);
    setFormData({...formData,
        address: getCurrentAddress?.address,
        city: getCurrentAddress?.city,
        phone: getCurrentAddress?.phone,
        pincode: getCurrentAddress?.pincode,
        notes: getCurrentAddress?.notes
    });
}

// Remove the old isFormValid function as it's now handled by the validation hook

useEffect(()=>{
        dispatch(fetchAllAddresses(user?.id))
    },[dispatch])

    console.log(addressList," addressList");


  return (
    <div className="space-y-6">
        {/* Address Cards */}
        {addressList && addressList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addressList.map((singleAddressItem) => (
                    <AddressCard 
                        key={singleAddressItem._id}
                        selectedId={selectedId}
                        addressInfo={singleAddressItem}
                        handleDeleteAddress={handleDeleteAddress}
                        handleEditAddress={handleEditAddress}
                        setCurrentSelectedAddress={setCurrentSelectedAddress}
                    />
                ))}
            </div>
        )}

        {/* Add/Edit Address Form */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">
                    {currentEditedId !== null ? 'Edit Address' : 'Add New Address'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {currentEditedId !== null ? 'Update your address information' : 'Enter your delivery address'}
                </p>
            </div>
            <div className="p-6">
                <ValidatedForm 
                    schema={addressSchema}
                    formControls={addressFormControls}
                    initialData={formData}
                    buttonText={currentEditedId !== null ? 'Update Address' : 'Add Address'}
                    onSubmit={handleManageAddress} 
                />
            </div>
        </div>
    </div>
  )
}

export default Address;