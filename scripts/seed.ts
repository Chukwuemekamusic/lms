const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
    try {
        await prisma.category.createMany({
            data: [
                {
                    name: "Web Development"
                },
                {
                    name: "Mobile Development"
                },
                {
                    name: "Data Science"
                },
                {
                    name: "Machine Learning"
                },
                {
                    name: "Computer Science"
                },
                {
                    name: "Artificial Intelligence"
                },
            ]
        })

        console.log("Categories seeded successfully")
    } catch (error) {
        console.error("Error seeding categories", error)
    }
}

main()