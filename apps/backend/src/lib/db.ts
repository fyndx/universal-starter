import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@/prisma/generated/client";

export const prisma = new PrismaClient({
	log:
		process.env.NODE_ENV === "development"
			? ["query", "error", "warn"]
			: ["error"],
}).$extends(withAccelerate());
