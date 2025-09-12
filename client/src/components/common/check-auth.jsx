import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const { authType } = useSelector(state => state.auth);

  // Debug logging
  console.log('CheckAuth - isAuthenticated:', isAuthenticated, 'user:', user, 'pathname:', location.pathname, 'authType:', authType);

  // Public routes that don't need login
  const publicPaths = [
    "/shop/home",
    "/shop/listing",
    "/shop/search",
    "/",
  ];

  // Admin-only routes (matching the routes defined in App.jsx)
  const adminPaths = ["/admin", "/admin/dashboard", "/admin/banner", "/admin/stats", "/admin/orders", "/admin/products"];

  // Redirect root `/` based on auth
  // For Auth0 users, let Auth0Provider handle the redirect after sync
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" replace />;
    }
    // Only redirect for non-Auth0 users or when user data is fully loaded
    if (authType !== 'auth0' && user?.role) {
      return user?.role === "admin"
        ? <Navigate to="/admin/dashboard" replace />
        : <Navigate to="/shop/home" replace />;
    }
  }

  // Protect admin routes
  if (location.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" replace />;
    }
  }

  // Protect checkout, account, and profile routes for shoppers
  if (location.pathname.startsWith("/shop/checkout") || 
      location.pathname.startsWith("/shop/account") ||
      location.pathname.startsWith("/shop/userprofile")) {
    if (!isAuthenticated) {
      // Save the page they tried to visit
      localStorage.setItem("redirectAfterLogin", location.pathname);
      return <Navigate to="/auth/login" replace />;
    }
  }

  // Redirect authenticated users away from login/register
  // But don't interfere with Auth0Provider's redirect logic for Auth0 users
  if (
    isAuthenticated &&
    authType !== 'auth0' && // Only redirect for non-Auth0 users
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
