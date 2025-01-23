import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { courseId: string, attachmentId: string } }) {
    try {
        const {courseId, attachmentId} = await params
        const {userId} = await auth()

        if (!userId) {
            console.log("User ID is required")
            return new NextResponse("Unauthorized", {status: 401})
        }
        if (!courseId) {
            console.log("Course ID is required")
            return new NextResponse("Course ID is required", {status: 400})
        }
        // check if it's course owner
        const courseOwner = await prisma.course.findUnique({
            where: {id: courseId, userId: userId}
        })
        if (!courseOwner) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if (!attachmentId) {
            return new NextResponse("No valid data provided", {status: 400})
        }

        const attachment = await prisma.attachment.delete({
            where: {id: attachmentId, courseId: courseId}
        })
        return new NextResponse("Attachment deleted", {status: 200})
    } catch (error) {
        console.log("Attachment delete error", error)
        return new NextResponse("Internal error", {status: 500})
    }
}