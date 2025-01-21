import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";


const MobileSideBar = () => {
    return (
        <Sheet>
            <SheetTitle></SheetTitle>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}

export default MobileSideBar;