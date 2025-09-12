import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/footer";

function ShoppingLayout() {
    return (
        <div className="flex flex-col bg-white overflow-hidden min-h-screen">
            {/* common header */}
            <ShoppingHeader/>
            <main className="flex flex-col w-full pt-14 md:pt-16 flex-1">
                <Outlet/>
            </main>
            {/* common footer */}
            <Footer/>
        </div>
    );
    
}

export default ShoppingLayout;