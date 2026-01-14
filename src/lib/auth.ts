import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/db";
import * as schema from "@/database/schema";
import { openAPI } from "better-auth/plugins";
import { username } from "better-auth/plugins/username";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "member",
      },
      username: {
        type: "string",
        required: true,
        unique: true,
      },
    },
  },
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 60 * 5, // 5 minutes
  //   },
  // },
  basePath: "/api",
  plugins: [
    openAPI(),
    username({
      minUsernameLength: 4,
      usernameValidator: (username) => {
        if (username === "admin") {
          return false;
        }
        return true;
      },
    }),
  ],
});

let _schema: Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>;

const getSchema = async () => {
  if (!_schema) {
    const schema = await auth.api.generateOpenAPISchema();
    // Campos username no schema de model User
    if (schema.components?.schemas?.User?.properties) {
      schema.components.schemas.User.properties.username = {
        type: "string",
      };
      schema.components.schemas.User.properties.displayUsername = {
        type: "string",
      };

      // Username apareça como obrigatório
      schema.components.schemas.User.required ||= [];
      if (!schema.components.schemas.User.required.includes("username")) {
        schema.components.schemas.User.required.push("username");
      }
    }

    // Atualizando o body do sign-up
    const signupPath =
      schema.paths?.["/sign-up/email"]?.post?.requestBody?.content?.[
        "application/json"
      ]?.schema;
    if (signupPath?.properties) {
      signupPath.properties.username = { type: "string" };
      signupPath.properties.displayUsername = { type: "string" };
      signupPath.required ||= [];
      if (!signupPath.required.includes("username")) {
        signupPath.required.push("username");
      }
    }

    _schema = schema;
  }
  return _schema;
};

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
