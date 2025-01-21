import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import CourseProgress from "@/app/(dashboard)/_components/CourseProgress";
import { LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";
import FormTitle from "./_components/FormTitle";
import FormDescription from "./_components/FormDescription";





interface PageProps {
    params: {
        courseId: string
    }
}

const CoursePage = async ({params} : PageProps) => {
    const {userId} = await auth()
    if (!userId) {
        return redirect("/")
    }

    const { courseId } = await params
    if (!courseId) {
        return redirect("/teacher/courses")
    }
    console.log("courseId", courseId)
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            userId: userId
        }
    })

    if (!course) {
        return redirect("/teacher/courses")
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Course Setup</h1>
                    <span className="text-sm text-muted-foreground">
                        Complete all fields {completionText}
                    </span>
                </div>
                {/* <CourseProgress
                    value={completedFields / totalFields}
                /> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} variant="default" />
                        <h2 className="text-xl">Customize your course</h2>
                    </div>
                    <FormTitle initialData={course} courseId={courseId} />
                    <FormDescription initialData={course} courseId={courseId} />
                </div>
            </div>
        </div>
    )
}

export default CoursePage