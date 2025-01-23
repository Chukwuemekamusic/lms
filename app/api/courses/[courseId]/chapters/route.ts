import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth()
        const { courseId } = await params
        const { title } = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!courseId) {
            return new NextResponse("Course ID is required", { status: 400 })
        }
        if (!title) {
            return new NextResponse("Title is required", { status: 400 })
        }

        const courseOwner = await prisma.course.findUnique({
            where: { id: courseId, userId: userId }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const lastChapter = await prisma.chapter.findFirst({
            where: { courseId: courseId },
            orderBy: { position: "desc" }
        })
        const newPosition = lastChapter ? lastChapter.position + 1 : 1

        const chapter = await prisma.chapter.create({
            data: { 
                title, 
                courseId, 
                position: newPosition 
            }
        })

        return NextResponse.json(chapter)
        
    } catch (error) {
        console.log("[CHAPTERS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}