import path from "path";
import express from "express";
import { ApolloServer } from "@apollo/server";

import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
// import getResolver from "./resolvers";
import { environment, initDatabase } from "./config";
import { resolvers, typeDefs } from "./graphql";
import { ApolloServerErrorPlugin } from "./lib";
import { authenticate } from "./middlewares";

// const typeDefs = `
// scalar Upload

// type Metadata {
//   currentPage: Int!
//   totalPage: Int!
//   totalSize: Int!
//   pageSize: Int!
// }

// type Content {
//   data: String
//   metadata: Metadata
// }

// type Response {
//   status: Boolean!
//   content: Content!
// }

// type File {
//     filename: String!
//     mimetype: String!
//     encoding: String!
//   }

// type Query {
// record(id:ID!): Record
// records: [Record]
// test: Response
// }

// type Mutation {
// createRecord(name: String!, position: String, level: String): Record
// deleteRecord(id: ID!): Boolean
// updateRecord(id: ID! name: String, position: String, level: String): Record
// singleUpload(file: Upload!): File!
// }

// type Role {
// id: ID
// name: String
// }

// type User {
// fullName: String
// id: ID
// phone: String
// roleId: ID
// role: Role
// }

// type Record {
// id: ID
// name: String
// position: String
// level: String
// userId: ID
// user: [User]
// }
// `;
async function main() {
  initDatabase();
  const app = express();
  // const { default: graphqlUploadExpress } = await import(
  //   "graphql-upload/graphqlUploadExpress.mjs"
  // );
  // console.log(graphqlUploadExpress);
  // const resolvers = await getResolver();

  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    // Using graphql-upload without CSRF prevention is very insecure.
    csrfPrevention: false,
    cache: "bounded",
    plugins: [ApolloServerErrorPlugin],
  });

  app.use(express.json());
  app.use(cors());

  app.use("/assets", express.static(path.join(__dirname, "assets")));

  await server.start();
  // app.use("/graphql", expressGraphQL.graphqlHTTP({schema: buildSchema(typeDefs) ,graphiql: true}));

  app.use("/graphql", expressMiddleware(server, { context: authenticate }));
  app.listen(environment.PORT, () => {
    console.log(
      `Server is running on http://localhost:${environment.PORT}/graphql`
    );
  });
}

main();
