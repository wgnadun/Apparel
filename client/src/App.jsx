import './App.css'
import AdminLayout from './components/admin-view/layout'
import AuthLayout from './components/auth/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminFeatures from './pages/admin-view/features'
import AdminOrders from './pages/admin-view/orders'
import AdminProducts from './pages/admin-view/products'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import { Routes,Route } from 'react-router-dom'
import ShoppingLayout from './components/shopping-view/layout'
import NotFound from './pages/Not-found'
import ShopppingCheckout from './pages/shoping-view/checkout'
import ShoppingAccount from './pages/shoping-view/account'
import ShoppingListing from './pages/shoping-view/listing'
import ShopppingHome from './pages/shoping-view/home'
import CheckAuth from './components/common/check-auth'

function App() {
  const isAuthenticated = false;
  const user = null;
  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        {/* commmon components */}
        <Routes>
         
            <Route path="/auth" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout/>
            </CheckAuth>}>   
                <Route path="login" element={<AuthLogin />} />
                <Route path="register" element={<AuthRegister />} />          
            </Route>
            
            <Route path="/admin" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout/>
            </CheckAuth>}>   
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="features" element={<AdminFeatures />} />          
                <Route path="orders" element={<AdminOrders />} />          
                <Route path="products" element={<AdminProducts />} />          
            </Route>
       
            <Route path="/shop" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout/> 
            </CheckAuth>}>   
                <Route path="home" element={<ShopppingHome />} />
                <Route path="checkout" element={<ShopppingCheckout />} />
                <Route path="account" element={<ShoppingAccount />} />
                <Route path="listing" element={<ShoppingListing />} />
            </Route>

                <Route path="*" element={<NotFound />} />
           
         </Routes>
    
      </div>
    </>
  )
}

export default App
