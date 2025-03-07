import { env } from "@/env";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
});
