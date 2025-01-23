import { PrismaClient } from "@prisma/client"

export const truncateUrl = (url: string, maxLength: number=30) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + "..."
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(price)
}

export const ownerCheck = async (userId: string, courseOwnerId: string, prisma: PrismaClient) => {
    const courseOwner = await prisma.course.findUnique({
        where: {
            id: courseOwnerId,
            userId: userId
        }
    })

    return !!courseOwner
}