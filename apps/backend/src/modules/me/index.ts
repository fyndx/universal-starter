import { withAuth } from "@/src/plugins/auth";
import { requireAuth } from "@/src/plugins/auth-guards";
import {
	makeErrorEnvelopeSchema,
	makeSuccessEnvelopeSchema,
} from "@/src/schemas/api-spec";
import { formatSuccessResponse } from "@/src/utils/format-response";
import Elysia, { t } from "elysia";

const UserSchema = t.Object({
	id: t.String({ description: "User unique identifier" }),
	email: t.String({ format: "email", description: "User email address" }),
	name: t.String({ description: "User display name" }),
	image: t.Optional(
		t.Union([t.String(), t.Null()], { description: "User profile image URL" }),
	),
	emailVerified: t.Boolean({
		description: "Whether the user's email is verified",
	}),
	createdAt: t.Date({ description: "User creation timestamp" }),
	updatedAt: t.Date({ description: "User last update timestamp" }),
	// Additional fields from Better Auth admin plugin
	banned: t.Optional(
		t.Union([t.Boolean(), t.Null()], {
			description: "Whether the user is banned",
		}),
	),
	role: t.Optional(
		t.Union([t.String(), t.Null()], { description: "User role" }),
	),
	banReason: t.Optional(
		t.Union([t.String(), t.Null()], {
			description: "Reason for ban if applicable",
		}),
	),
	banExpires: t.Optional(
		t.Union([t.Date(), t.Null()], {
			description: "Ban expiration date if applicable",
		}),
	),
});

export const meRoutes = () =>
	new Elysia({ prefix: "/me" })
		.use(withAuth())
		.use(requireAuth())
		.get(
			"/",
			({ user }) => {
				// Ensure user is not null
				if (!user) {
					throw new Error("User not found");
				}

				// Transform user object to match schema requirements
				const userResponse = {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image ?? null,
					emailVerified: user.emailVerified,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
					banned: user.banned ?? null,
					role: user.role ?? null,
					banReason: user.banReason ?? null,
					banExpires: user.banExpires ?? null,
				};

				return formatSuccessResponse({
					code: "USER_FETCHED",
					data: userResponse,
				});
			},
			{
				detail: {
					tags: ["User"],
					summary: "Get current user profile",
					description: "Retrieves the authenticated user's profile information",
					security: [{ bearerAuth: [] }],
				},
				response: {
					200: makeSuccessEnvelopeSchema(UserSchema),
					401: makeErrorEnvelopeSchema(),
				},
			},
		);
