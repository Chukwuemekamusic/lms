"use client"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"
import { LogOut } from "lucide-react"

export const NavbarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isPlayerPage = pathname?.includes("/courses");

    return (
        <div className="flex items-center gap-x-2 ml-auto">
            {isTeacherPage || isPlayerPage ? (
                <Link href="/">
                    <Button size="sm" variant="ghost" className=" bg-blue-50 hover:bg-blue-200">
                        <LogOut className="w-4 h-4 mr-2" />
                        Exit
                    </Button>
                </Link>
            ) : (
                <Link href="/teacher/courses">
                    <Button size="sm" variant="ghost"  className=" bg-blue-50 hover:bg-blue-200">
                        Teacher Mode
                    </Button>
                </Link>
            )}
            <UserButton />
        </div>
    )
}