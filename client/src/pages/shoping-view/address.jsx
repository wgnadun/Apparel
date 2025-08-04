import CommonForm from '@/components/common/form'
import AddressCard from '@/components/shopping-view/address-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addressFormControls } from '@/config'
import { addNewAddress, deleteAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const initialAddressFormData ={
    address:'',
    city:'',
    phone:'',
    pincode:'',
    notes: ''
}

function Address() {
    
    const [formData,setFormData] =  useState(initialAddressFormData)
    const dispatch = useDispatch();
    const {user} =useSelector((state)=>state.auth);
    const {addressList} =useSelector((state)=>state.shopAddress);
   
 function handleManageAddress(event){
        event.preventDefault();   
        dispatch(addNewAddress({...formData,userId:user?.id})
    ).then((data)=>{
        if(data?.payload?.success){
            dispatch(fetchAllAddresses(user?.id))
            setFormData(initialAddressFormData);
        }
    }) 
}

function handleDeleteAddress(getCurrentAddress){
  console.log(getCurrentAddress);
  dispatch(deleteAddress({userId: user?.id, addressId: getCurrentAddress?._id})).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchAllAddresses(user?.id))
      }
  })
}

function isFormValid() {
        return Object.keys(formData).map(key=> formData[key].trim() !=='').every(item=> item === true)
    }

useEffect(()=>{
        dispatch(fetchAllAddresses(user?.id))
    },[dispatch])

    console.log(addressList," addressList");


  return (
    <Card>
        <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {
                addressList && addressList.length > 0 ?
                addressList.map(singleAddressItem=> <AddressCard 
                    addressInfo={singleAddressItem}
                    handleDeleteAddress={handleDeleteAddress}
                   
                />) : null
            }
        </div>
    <CardHeader>
        <CardTitle>Add new Address</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
        <CommonForm 
            formControls={addressFormControls}
            formData={formData} 
            setFormData={setFormData} 
            submitText="Add Address"
            onSubmit={handleManageAddress} 
            isBtnDisabled={!isFormValid()}
        />
    </CardContent>
    </Card>
  )
}

export default Address;