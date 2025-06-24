import './App.css'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import { Routes,Route } from 'react-router-dom'

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
        </Routes>
      </div>
    </>
  )
}

export default App
