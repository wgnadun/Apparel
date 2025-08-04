import CommonForm from '@/components/common/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { addressFormControls } from '@/config'
import  { useState } from 'react'

const initialAddressFormData ={
    address:'',
    city:'',
    phone:'',
    pincode:'',
    notes: ''
}

function Address() {
    
    const [formData,setFormData] =  useState(initialAddressFormData)
    function handleManageAddress(event){
        event.preventDefault();    
    }

    function isFormValid() {
        return Object.keys(formData).map(key=> formData[key] !=='').every(item=> item === true)
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