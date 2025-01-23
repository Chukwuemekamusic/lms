import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { LayoutDashboard, ListCheck, CircleDollarSign } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";
import FormTitle from "./_components/FormTitle";
import FormDescription from "./_components/FormDescription";
import GenericForm from "./_components/GenericForm";
import FormImage from "./_components/FormImage";
import FormCategory from "./_components/FormCategory";
import FormPrice from "./_components/FormPrice";
import FormAttachment from "./_components/FormAttachment";
import FormChapter from "./_components/FormChapter";


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

    // get course from db and include attachments
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            userId: userId
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            chapters: {
                orderBy: {
                    position: "asc",
                },
            }
        }
    })
    // get categories from db
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc"
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
        course.chapters.some(chapter => chapter.isPublished)
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
                
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-7 mt-16">
                <div className="">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} variant="default" />
                        <h2 className="text-xl">Customize your course</h2>
                    </div>
                    <FormTitle initialData={course} courseId={courseId} />
                    <FormDescription initialData={course} courseId={courseId} />
                    <FormImage initialData={course} courseId={courseId} />
                    <FormCategory initialData={course} courseId={courseId} options={categories.map(category => (
                        {
                            label: category.name,
                            value: category.id
                        }
                    ))} />
                </div>
                <div className="space-y-6">
                    <div className="">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListCheck} />
                            <h2 className="text-xl">Course chapters</h2>
                        </div>
                        <div className="">
                            <FormChapter initialData={course} courseId={courseId} />
                        </div>
                        <div className="flex items-center gap-x-2 mt-6">
                            <IconBadge icon={CircleDollarSign}  />
                            <h2 className="text-xl">Sell your course</h2>
                        </div>
                        <FormPrice initialData={course} courseId={courseId} />
                        <FormAttachment initialData={course} courseId={courseId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePage

{/* <GenericForm 
                        initialData={course}
                        courseId={courseId}
                        fieldConfig={{
                            name: "description",
                            label: "Course description",
                            placeholder: "add a description",
                            type: "textarea" as const,
                            minLength: 2
                          }}
                    /> */}