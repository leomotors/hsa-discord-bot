import { z } from "zod";

const environmentSchema = z.object({
  DISCORD_TOKEN: z.string().min(10),
  GUILD_ID: z
    .string()
    .min(10, "Guild ID should be at least 10 characters long"),
  ALLOWED_USERS: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim()))
    .pipe(
      z.array(
        z.string().min(10, "User ID should be at least 10 characters long"),
      ),
    ),
  PA_NAME: z.string().nonempty("PA_NAME should not be empty"),
  COLOR_THEME: z.coerce.number(),
  STARTABLE_CONTAINERS: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim()))
    .pipe(z.string().array()),
});

export const environment = environmentSchema.parse(process.env);
