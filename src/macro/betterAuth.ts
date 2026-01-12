import { auth } from "@/lib/auth";
import Elysia from "elysia";

export const betterAuth = new Elysia({ name: "better-auth" })
  .decorate("user", null as typeof auth.$Infer.Session.user | null)
  .decorate("session", null as typeof auth.$Infer.Session.session | null)
  .mount(auth.handler)
  .macro({
    needsAuth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
