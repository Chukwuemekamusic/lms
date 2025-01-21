"use client"
// import { Compass, Layout } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { guestRoutes, teacherRoutes } from "@/constants";
import { usePathname } from "next/navigation";


export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.startsWith("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}