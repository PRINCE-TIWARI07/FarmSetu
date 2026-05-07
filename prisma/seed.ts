import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Fruits",
    slug: "fruits",
    description: "Fresh seasonal fruits from local farms.",
  },
  {
    name: "Vegetables",
    slug: "vegetables",
    description: "Daily vegetables and leafy produce.",
  },
  {
    name: "Dairy",
    slug: "dairy",
    description: "Milk, paneer, curd, ghee, and other dairy essentials.",
  },
  {
    name: "Grains",
    slug: "grains",
    description: "Rice, wheat, millets, pulses, and cereals.",
  },
  {
    name: "Organic",
    slug: "organic",
    description: "Certified and naturally grown organic produce.",
  },
];

async function main() {
  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      }),
    ),
  );

  console.log(`Seeded ${categories.length} product categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
