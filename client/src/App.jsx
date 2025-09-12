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
import { useAuth0 } from '@auth0/auth0-react';
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
 const {user,isAuthenticated,isLoading,authType} = useSelector(state=> state.auth);
 const dispatch =  useDispatch();
 const { isLoading: auth0IsLoading, isAuthenticated: auth0IsAuthenticated } = useAuth0();
   
 useEffect(()=>{
    console.log('App useEffect - authType:', authType, 'isAuthenticated:', isAuthenticated, 'auth0IsLoading:', auth0IsLoading, 'auth0IsAuthenticated:', auth0IsAuthenticated);
    
    // Wait for Auth0 to finish loading before making auth decisions
    if (auth0IsLoading) {
      console.log('Auth0 still loading, waiting...');
      return;
    }
    
    // If Auth0 user is authenticated, don't check JWT
    if (auth0IsAuthenticated) {
      console.log('Auth0 user is authenticated, skipping JWT check');
      return;
    }
    
    // Only check JWT auth if not using Auth0 and Auth0 is not authenticated
    if (authType !== 'auth0') {
      console.log('Dispatching checkAuth() for JWT authentication');
      dispatch(checkAuth())
    } else {
      console.log('Skipping checkAuth() because authType is auth0');
    }
 },[dispatch, authType, auth0IsLoading, auth0IsAuthenticated])

 if(isLoading) return <Skeleton className="h-[600px] w-[800px] bg-black" />
 console.log('App - pathname:', location.pathname, 'isAuthenticated:', isAuthenticated, 'authType:', authType, 'user:', user);

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
