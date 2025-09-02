import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Public routes that don't need login
  const publicPaths = [
    "/shop/home",
    "/shop/listing",
    "/shop/search",
    "/",
  ];

  // Admin-only routes
  const adminPaths = ["/admin", "/admin/dashboard", "/admin/features", "/admin/orders", "/admin/products"];

  // Redirect root `/` based on auth
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" replace />;
    }
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
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
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
