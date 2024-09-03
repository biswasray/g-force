import dotenv from "dotenv";
dotenv.config();

export const environment = {
  PORT: process.env.PORT || "9000",
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/graphql-server",
  JWT_KEY: process.env.JWT_KEY || "abcd",
};
