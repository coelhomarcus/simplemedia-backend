import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import * as z from "zod";
import { OpenAPI } from "@/lib/auth";
import { userRoutes, communityRoutes } from "@/route";

const app = new Elysia()
  .use(
    openapi({
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .use(userRoutes)
  .use(communityRoutes)
  .listen(3000);

console.log(`🦊 Elysia http://${app.server?.hostname}:${app.server?.port}`);
