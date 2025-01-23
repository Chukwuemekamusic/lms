import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth()
        const { courseId } = await params
        const { list } = await req.json()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!courseId) {
            return new NextResponse("Course ID is required", { status: 400 })
        }
        

        const courseOwner = await prisma.course.findUnique({
            where: { id: courseId, userId: userId }
        })

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        
        for (let item of list) {
            await prisma.chapter.update({
                where: { 
                    id: item.id 
                },
                data: {
                    position: item.position
                }
            })
        }

        return NextResponse.json("Success", { status: 200 })
        
    } catch (error) {
        console.log("[CHAPTERS_REORDER]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}