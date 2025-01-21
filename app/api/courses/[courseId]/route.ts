import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: {params: {courseId: string}}) {
    try {
        const {courseId} = await params
        const {userId} = await auth()
        const values = await req.json();

        if (!userId) {
            console.log("User ID is required")
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!courseId) {
            console.log("Course ID is required")
            return new NextResponse("Course ID is required", {status: 400})
        }

        if (!values || Object.keys(values).length === 0) {
            return new NextResponse("No valid data provided", {status: 400})
        }

    
        const course = await prisma.course.findUnique({
            where: {id: courseId, userId: userId}
        })
        if (!course) {
            return new NextResponse("Course not found", {status: 404})
        }

        const updatedCourse = await prisma.course.update({
            where: {id: courseId, userId: userId},
            data: {
                ...values
            }
        })
        return NextResponse.json(updatedCourse)

    } catch (error) {
        console.log("[COURSE_ID_PATCH]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}