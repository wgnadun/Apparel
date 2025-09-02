import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Users
} from "lucide-react";

// Country code to full name mapping
const countryNameMap = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IN': 'India',
  'LK': 'Sri Lanka',
  'SG': 'Singapore',
  'AE': 'United Arab Emirates',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'NP': 'Nepal',
  'JP': 'Japan',
};

const initialState = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phone: "",
  country: "",
  password: "",
  confirmPassword: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.userName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Format phone number with country code
    const countryData = registerFormControls.find(control => control.name === 'country')?.options?.find(option => option.id === formData.country);
    const dialCode = countryData?.label?.match(/\+(\d+)/)?.[1];
    const formattedPhone = dialCode ? `+${dialCode} ${formData.phone}` : formData.phone;
    
    // Get full country name from mapping
    const countryName = countryNameMap[formData.country] || formData.country;
    
    const registrationData = {
      ...formData,
      phone: formattedPhone,
      country: countryName,
    };
    
    // Remove confirmPassword from the data sent to server
    delete registrationData.confirmPassword;
    
    dispatch(registerUser(registrationData)).then((data) => {
       if(data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/auth/login")
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create a new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;