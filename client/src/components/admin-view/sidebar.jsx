import {
  LayoutDashboard,
  Package,
  CreditCard,
  Shield,
  Sparkles
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Badge } from "../ui/badge";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    badge: null
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <Package className="w-5 h-5" />,
    badge: "12"
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <CreditCard className="w-5 h-5" />,
    badge: "5"
  }
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`group relative flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
              isActive
                ? "bg-black text-white shadow-md"
                : "text-slate-600 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <div className={`transition-transform duration-200 group-hover:scale-110 ${
              isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
            }`}>
              {menuItem.icon}
            </div>
            <span className="flex-1">{menuItem.label}</span>
            {menuItem.badge && (
              <Badge 
                variant={isActive ? "secondary" : "default"}
                className={`text-xs font-semibold ${
                  isActive 
                    ? "bg-white/20 text-white border-white/30" 
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {menuItem.badge}
              </Badge>
            )}
            {isActive && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-black border-gray-800">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-gray-800">
              <SheetTitle className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                  <p className="text-sm text-gray-400">Management Dashboard</p>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 p-6">
              <MenuItems setOpen={setOpen} />
            </div>
            <div className="p-6 border-t border-gray-800">
              <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">Premium Access</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col bg-black border-r border-gray-800 shadow-lg lg:flex">
        <div className="p-6 border-b border-gray-800">
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="flex cursor-pointer items-center gap-3 group"
          >
            <div className="p-2 bg-white rounded-xl">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors duration-200">Admin Panel</h1>
              <p className="text-sm text-gray-400">Management Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <MenuItems />
        </div>
        
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors duration-200 cursor-pointer group">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">Premium Access</p>
            </div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;