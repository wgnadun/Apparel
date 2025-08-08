import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section with Background Image */}
      <div
        className="hidden lg:flex items-center justify-center w-1/2 px-12 relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Content */}
        <div className="relative max-w-md space-y-6 text-center text-white">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Welcome to <span className="text-yellow-400">ECommerce</span> Store
          </h1>
          <p className="text-lg opacity-80">
            Discover premium apparel, designed for style and comfort.
          </p>
        </div>
      </div>

      {/* Right Section (Form Outlet) */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md shadow-lg rounded-xl p-8 bg-white border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
