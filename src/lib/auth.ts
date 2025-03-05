import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { cache } from "react";
import { headers } from "next/headers";
import { db } from "@/server/db";


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        plugins: [
            nextCookies(),
        ],
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
        }
    }
});

export const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers()
    })
})
        