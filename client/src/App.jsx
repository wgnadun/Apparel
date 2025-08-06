import { Route, Routes } from 'react-router-dom';
import './App.css'
import CheckAuth from './components/common/check-auth';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import AdminLayout from './components/admin-view/layout';
import AdminDashboard from './pages/admin-view/dashboard';
import AdminFeatures from './pages/admin-view/features';
import AdminOrders from './pages/admin-view/orders';
import AdminProducts from './pages/admin-view/products';
import ShoppingLayout from './components/shopping-view/layout';
import ShoppingHome from './pages/shoping-view/home';
import ShoppingCheckout from './pages/shoping-view/checkout';
import ShoppingAccount from './pages/shoping-view/account';
import ShoppingListing from './pages/shoping-view/listing';
import NotFound from './pages/Not-found';
import UnauthPage from './pages/unauth-page';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/auth-slice';
import { useEffect } from 'react';
import { Skeleton } from './components/ui/skeleton';
import { Toaster } from './components/ui/sonner';
import PaypalReturnPage from './pages/shoping-view/paypal-return';
import PaymentSuccessPage from './pages/shoping-view/payment-success';

function App() {
 const {user,isAuthenticated,isLoading} = useSelector(state=> state.auth);
 const dispatch =  useDispatch();
   
 useEffect(()=>{
    dispatch(checkAuth())
 },[dispatch])

 if(isLoading) return <Skeleton className="h-[600px] w-[800px] bg-black" />
 console.log(location.pathname,isAuthenticated);

  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        {/* commmon components */}
        <Routes>

          <Route path="/auth" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
          </CheckAuth>
          }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
          }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>

          <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
          } 
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="paypal-return" element={<PaypalReturnPage/>}/>
            <Route path="payment-success" element={<PaymentSuccessPage/>}/>
          </Route>

          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />

        </Routes>

      </div>
      <Toaster />
    </>
  )
}

export default App
