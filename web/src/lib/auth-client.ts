import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
    basePath: "/api/auth",
}) 