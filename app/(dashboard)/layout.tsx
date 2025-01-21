import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full ">
            <div className="h-[80px] md:pl-[250px] fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>

            <div className="hidden md:flex flex-col h-full w-[250px] z-30 fixed inset-y-0">
                <Sidebar />
            </div>
            <main className="mt-[80px] md:pl-[250px] h-full">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout;