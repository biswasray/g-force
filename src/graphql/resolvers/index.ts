import avatarResolvers from "./avatar";
import profileResolvers from "./profile";
import roleResolvers from "./role";
import userResolvers from "./user";

export const resolvers = {
  ...roleResolvers,
  ...userResolvers,
  ...profileResolvers,
  ...avatarResolvers,
  Query: {
    ...avatarResolvers.Query,
    ...roleResolvers.Query,
    ...userResolvers.Query,
    ...profileResolvers.Query,
  },
  Mutation: {
    ...avatarResolvers.Mutation,
    ...roleResolvers.Mutation,
    ...userResolvers.Mutation,
    ...profileResolvers.Mutation,
  },
};
