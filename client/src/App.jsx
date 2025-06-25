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
import ShoppingLayout from './pages/shoping-view/layout'
import ShoppingHeader from './pages/shoping-view/header'
import NotFound from './pages/Not-found'

function App() {
  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        {/* commmon components */}
        <h1>header</h1>
        <Routes>
         
            <Route path="/auth" element={<AuthLayout/>}>   
                <Route path="login" element={<AuthLogin />} />
                <Route path="register" element={<AuthRegister />} />          
            </Route>
            
            <Route path="/admin" element={<AdminLayout/>}>   
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="features" element={<AdminFeatures />} />          
                <Route path="orders" element={<AdminOrders />} />          
                <Route path="products" element={<AdminProducts />} />          
            </Route>
       
            <Route path="/shopping" element={<ShoppingLayout/>}>   
                <Route path="header" element={<ShoppingHeader />} />
            </Route>
                <Route path="*" element={<NotFound />} />
           
         </Routes>
    
      </div>
    </>
  )
}

export default App
