import { z } from "zod";
import { insertUserSchema, users } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    createOrGet: {
      method: "POST" as const,
      path: "/api/users" as const,
      input: z.object({
        username: z.string().min(1).max(50),
        password: z.string().min(1),
        house: z.string().min(1),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(), // Return existing
        201: z.custom<typeof users.$inferSelect>(), // Return new
        400: errorSchemas.validation,
      },
    },
    updateProgress: {
      method: "POST" as const,
      path: "/api/users/:id/progress" as const,
      input: z.object({
        scoreAdded: z.number(),
        gameCompleted: z.number().min(1).max(4),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    makeFinalChoice: {
      method: "POST" as const,
      path: "/api/users/:id/choice" as const,
      input: z.object({
        choice: z.enum(["seal", "expose", "erase"]),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  leaderboard: {
    get: {
      method: "GET" as const,
      path: "/api/leaderboard" as const,
      responses: {
        200: z.array(
          z.object({
            id: z.number(),
            username: z.string(),
            score: z.number(),
            finalChoice: z.string().nullable(),
          })
        ),
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CreateUserRequest = z.infer<typeof api.users.createOrGet.input>;
export type UpdateProgressRequest = z.infer<
  typeof api.users.updateProgress.input
>;
export type FinalChoiceRequest = z.infer<
  typeof api.users.makeFinalChoice.input
>;
export type UserResponse = z.infer<typeof api.users.createOrGet.responses[200]>;
export type LeaderboardResponse = z.infer<
  typeof api.leaderboard.get.responses[200]
>;
