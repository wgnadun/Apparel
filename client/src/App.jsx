import { Route, Routes } from 'react-router-dom';
import './App.css'
import CheckAuth from './components/common/check-auth';
import AuthLayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import AdminLayout from './components/admin-view/layout';
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
import CSRFTest from './components/debug/csrf-test';
import { Toaster } from './components/ui/sonner';
import PaypalReturnPage from './pages/shoping-view/paypal-return';
import PaymentSuccessPage from './pages/shoping-view/payment-success';
import SearchProducts from './pages/shoping-view/search';
import AdminDashboardBanner from './pages/admin-view/dashboardBanner';
import AdminDashboardStats from './pages/admin-view/dashboardStats';
import AdminDashboard from './pages/admin-view/dashboard';
import UserProfile from './pages/shoping-view/userprofile';

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
          <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          </CheckAuth>
          }

          />
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
          <Route path="dashboard" element={<AdminDashboard />}/>

            <Route path="banner" element={<AdminDashboardBanner/>}/>
            <Route path="stats" element={<AdminDashboardStats/>}/>
            
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />

          </Route>

{/* //shop public routes */}

          <Route path="/shop" element={<ShoppingLayout />  } >

            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="search" element={<SearchProducts/>}/>
            <Route path="csrf-test" element={<CSRFTest />} />
          
          </Route>

{/* //shop auth routes */}

          <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
          } 
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="userprofile" element={<UserProfile />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="paypal-return" element={<PaypalReturnPage/>}/>
            <Route path="payment-success" element={<PaymentSuccessPage/>}/>
            <Route path="search" element={<SearchProducts/>}/>
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
