"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


type SidebarItemsProps = {
    icon: LucideIcon,
    label: string,
    href: string,
}



const SidebarItem = ({ icon: Icon, label, href }: SidebarItemsProps) => {
    const pathname = usePathname()
    const router = useRouter()
    
    const isActive = 
        (pathname === href) || 
        (pathname === "/" && href === "/") || 
        pathname?.startsWith(`${href}/`)

    const onClick = () => {
        router.push(href)
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-sm font-medium transition-all text-muted-foreground hover:text-zinc-700 hover:bg-zinc-300/20 pl-6",
                isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700 border-sky-700 border-r-4"
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-muted-foreground h-4 w-4",
                        isActive && "text-sky-700"
                    )}
                />
                <span className="truncate">
                    {label}
                </span>
            </div>
        </button>
    )
}

export default SidebarItem;