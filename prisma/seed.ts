import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

const categoryData: Prisma.CategoryCreateInput[] = [
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

export async function main() {
  try {
    for (const u of categoryData) {
      await prisma.category.create({ data: u })
    }
    console.log("Categories seeded successfully")
  } catch (error) {
    console.error("Error seeding categories", error)
  }
}

main()