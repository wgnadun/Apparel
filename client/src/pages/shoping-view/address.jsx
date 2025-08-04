import CommonForm from '@/components/common/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addressFormControls } from '@/config'
import { addNewAddress } from '@/store/shop/address-slice'
import  { useState } from 'react'
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
   
 function handleManageAddress(event){
        event.preventDefault();   
        dispatch(addNewAddress({...formData,userId:user?.id})
    ).then((data)=>{
        console.log(data)
    }) 
    }

    function isFormValid() {
        return Object.keys(formData).map(key=> formData[key].trim() !=='').every(item=> item === true)
    }

  return (
    <Card>
        <div>
            Address List
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