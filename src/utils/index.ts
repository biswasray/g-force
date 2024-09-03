import jwt from "jsonwebtoken";
import { IUser } from "../models/user";
import { environment } from "../config";

export const signToken = (user: IUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    environment.JWT_KEY || "your-secret-key",
    { expiresIn: "1d" }
  );
};
export function getCurrentDate() {
  return new Date();
}
