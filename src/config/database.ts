import mongoose from "mongoose";
import { environment } from "./environment";

export async function initDatabase() {
  return await mongoose.connect(environment.MONGO_URI);
}
