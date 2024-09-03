import jwt from "jsonwebtoken";
import { environment } from "../config";
import { BaseContext, ContextFunction } from "@apollo/server";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";

export const authenticate: ContextFunction<
  [ExpressContextFunctionArgument],
  BaseContext
> = async ({ req }) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (typeof token === "string") {
    const decoded = jwt.verify(token, environment.JWT_KEY || "your-secret-key");
    return { user: decoded };
  }
  return {};
};
