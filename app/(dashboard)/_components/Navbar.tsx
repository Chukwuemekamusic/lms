import MobileSideBar from "./MobileSideBar";
import { NavbarRoutes } from "@/components/NavbarRoutes";

const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white text-sm shadow-sm">
            <div className="md:hidden">
                <MobileSideBar />
            </div>
            <NavbarRoutes />

        </div>
    )

}

export default Navbar;