import { GraphQLError } from "graphql";
// import expressGraphQL from "express-graphql";
// import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { finished } from "stream/promises";

const db = {
  records: [
    { name: "anxjnw", position: 0, level: 1, id: `${Date.now()}`, userId: 1 },
  ],
  roles: [
    {
      id: "0",
      name: "admin",
    },
    {
      id: "1",
      name: "client",
    },
  ],
  users: [
    { fullName: "Biswasray", id: 1, phone: "9583672357", roleId: "0" },
    { fullName: "Olivia", id: 2, phone: "9876543210", roleId: "1" },
  ],
};
for (let i = 0; i < 10; i++) {
  const l = db.records.at(-1);
  if (!l) {
    continue;
  }
  const t = { ...l };
  t.id = `${Number(t.id) + 1}`;
  t.level++;
  t.position++;
  t.userId = Math.floor(i / 5) + 1;
  db.records.push(t);
}

async function getResolver() {
  // const { default: GraphQLUpload } = await import(
  //   "graphql-upload/GraphQLUpload.mjs"
  // );
  const resolvers = {
    User: {
      role: (
        parent: { roleId: string },
        args: any,
        context: any,
        info: any
      ) => {
        return db.roles.find((r) => r.id === parent.roleId);
      },
    },
    Record: {
      user: (parent: any, args: any, context: any, info: any) => {
        return db.users.filter((u) => u.id === parent.userId);
      },
    },
    Query: {
      async record(_: any, { id }: { id: string }) {
        const rec = db.records.find((r) => r.id === id);
        return rec || null;
      },
      async records(_: any, __: any, context: any) {
        return db.records;
      },
      async test() {
        throw new Error("Not Found");
        // throw new GraphQLError('the error message', {
        //   extensions: {
        //     code: 'SOMETHING_BAD_HAPPENED',
        //     http: {
        //       status: 404,
        //       headers: new Map([
        //         ['some-header', 'it was bad'],
        //         ['another-header', 'seriously'],
        //       ]),
        //     },
        //   },
        // });
        //   return {
        //     status: true,
        //     content: {
        //       data: "data",
        //       metadata: {
        //         currentPage: 1,
        //         totalPage: 10,
        //         totalSize: 100,
        //         pageSize: 10,
        //       },
        //     },
        //   };
      },
    },
    Mutation: {
      // Upload: GraphQLUpload,
      async createRecord(
        _: any,
        { name, position, level, userId }: any,
        context: any
      ) {
        const insert = { name, position, level, userId, id: `${Date.now()}` };
        db.records.push(insert);
        if (insert) return { name, position, level, id: insert.id };
        return null;
      },
      async updateRecord(_: any, args: any, context: any) {
        const id = args.id;
        db.records = db.records.map((r) =>
          r.id === id ? { ...r, ...args } : r
        );
        const rec = db.records.find((r) => r.id === id);
        return rec || null;
      },
      async deleteRecord(_: any, { id }: any, context: any) {
        const oldl = db.records.length;
        db.records = db.records.filter((r) => r.id !== id);
        return oldl !== db.records.length;
      },
      singleUpload: async (parent: any, { file }: { file: any }) => {
        const { createReadStream, filename, mimetype, encoding } = await file;

        // Invoking the `createReadStream` will return a Readable Stream.
        // See https://nodejs.org/api/stream.html#stream_readable_streams
        const stream = createReadStream();

        // This is purely for demonstration purposes and will overwrite the
        // local-file-output.txt in the current working directory on EACH upload.
        const out = require("fs").createWriteStream("local-file-output.txt");
        stream.pipe(out);
        await finished(out);

        return { filename, mimetype, encoding };
      },
    },
  };
  return resolvers;
}

export default getResolver;
