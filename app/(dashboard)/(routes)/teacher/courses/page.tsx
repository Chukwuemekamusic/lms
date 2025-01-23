import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const TeacherCoursesPage = async () => {
    const {userId} = await auth()
    if (!userId) {
        return redirect("/sign-in")
    }
    const courses = await prisma.course.findMany({
        where: {
            userId : userId
        }
    })
    return (
        <div className="p-6">
            <Link href="/teacher/create">
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Course
                </Button>
            </Link>
            <div className="mt-6">
                {courses.map((course) => (
                    <div key={course.id}>
                        <Link href={`/teacher/courses/${course.id}`}>
                            <h3>{course.title}</h3>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeacherCoursesPage;