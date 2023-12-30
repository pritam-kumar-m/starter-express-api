import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
const connectToMongo = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection is successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default connectToMongo;
