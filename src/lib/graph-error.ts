import { ApolloServerPlugin } from "@apollo/server";
import { GraphQLError } from "graphql";
import { ERROR_STATUS_CODES } from "./status-codes";

// export class AuthenticationError extends GraphQLError {
//   constructor(message: string) {
//     super(message, {
//       extensions: {
//         code: "UNAUTHENTICATED",
//         http: { status: 401 },
//       },
//     });
//   }
// }

// export class ForbiddenError extends GraphQLError {
//   constructor(message: string) {
//     super(message, {
//       extensions: {
//         code: "FORBIDDEN",
//         http: { status: 401 },
//       },
//     });
//   }
// }
export class GraphError extends GraphQLError {
  constructor(
    code: keyof typeof ERROR_STATUS_CODES,
    option: { message?: string }
  ) {
    if (!(code in ERROR_STATUS_CODES)) {
      code = "INTERNAL_SERVER_ERROR";
    }
    const status = ERROR_STATUS_CODES[code];
    super(option?.message ?? code, {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status },
      },
    });
  }
}
export const ApolloServerErrorPlugin: ApolloServerPlugin<{
  user?: unknown;
}> = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        response.http.headers.set("custom-header", "hello");
        if (
          response.body.kind === "single" &&
          response.body.singleResult.errors?.[0]?.extensions?.code ===
            "INTERNAL_SERVER_ERROR"
        ) {
          response.http.status = 500;
        }
      },
    };
  },
};
