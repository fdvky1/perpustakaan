import { PrismaClient } from "@prisma/client";
import { createSoftDeleteMiddleware } from "prisma-soft-delete-middleware";

const prismaClientSingleton = () => new PrismaClient();

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton|undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
prisma.$use(
    createSoftDeleteMiddleware({
      models: {
        User: {
            field: "deleted_at",
            createValue: (deleted) => {
                if (deleted) return new Date();
                return null;
            }
        },
        Book: {
          field: "deleted_at",
          createValue: (deleted) => {
            if (deleted) return new Date();
            return null;
          }
        }
      },
    })
  );
export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;