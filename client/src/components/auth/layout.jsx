import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function AuthLayout() {
  const images = [
    "https://res.cloudinary.com/dxzsfmpzu/image/upload/v1754730694/young-children-spending-time-together_j3s3m0.jpg",
    "https://res.cloudinary.com/dxzsfmpzu/image/upload/v1754730273/q_er3g5r.jpg",
    "https://res.cloudinary.com/dxzsfmpzu/image/upload/v1754730985/portrait-sexy-handsome-fashion-male-model-man-dressed-elegant-suit-posing-street-blue-sky_1_svelks.jpg",
    "https://res.cloudinary.com/dxzsfmpzu/image/upload/v1754732402/sexy-blond-woman-big-sunglasses-with-full-lips-posing-outdoor-red-jacket-stylish-silver-accessorises-perfect-figure_ysrpi2.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="flex min-h-screen w-full">

      {/* Left Section with Slideshow */}
      <div
        className="hidden lg:flex items-center justify-center w-1/2 px-12 relative transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${images[index]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for better text visibility */}

        {/* Content */}
        <div className="relative max-w-md space-y-6 text-center text-white">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Welcome to the<span className="text-yellow-400"> FashionHub</span>
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
