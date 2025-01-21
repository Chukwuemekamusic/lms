import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";


export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await prisma.course.create({
            data: {
                title,
                userId,
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
