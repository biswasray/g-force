import { GraphError } from "../../lib";
import Models from "../../models";
import { signToken } from "../../utils";

const userResolvers = {
  User: {
    role: async (
      parent: { roleId: string },
      args: any,
      context: any,
      info: any
    ) => {
      return await Models("role")
        .findById(parent.roleId)
        .populate("createdBy updatedBy");
    },
  },
  Query: {
    users: async (_: any, __: any, { user }: { user?: any }) => {
      //   if (!user)
      //     throw new AuthenticationError(
      //       "You must be logged in to perform this action"
      //     );
      return await Models("user").find().populate("createdBy updatedBy");
    },
    user: async (_: any, { id }: { id: string }, { user }: { user?: any }) => {
      //   if (!user)
      //     throw new AuthenticationError(
      //       "You must be logged in to perform this action"
      //     );
      return await Models("user").findById(id).populate("createdBy updatedBy");
    },
    me: async (_: any, args: any, context: any) => {
      if (!context.user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      return await Models("user")
        .findById(context.user.id)
        .populate("role createdBy updatedBy");
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      {
        username,
        email,
        password,
        roleId,
      }: { username: string; email: string; password: string; roleId: string }
    ) => {
      const existingUser = await Models("user").findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        throw new Error("User with this username or email already exists");
      }

      const _user = { username, email, password, roleId };
      const user = await Models("user").create(_user);

      const token = signToken(user);
      return {
        token,
        user: await Models("user").findById(user.id).populate("role"),
      };
    },
    signIn: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await Models("user").findOne({ email }).populate("role");
      if (!user) {
        throw new GraphError("UNAUTHORIZED", {
          message: "Invalid email or password",
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new GraphError("UNAUTHORIZED", {
          message: "Invalid email or password",
        });
      }

      const token = signToken(user);
      return { token, user };
    },
    updateUser: async (
      _: any,
      {
        id,
        username,
        email,
        password,
        roleId,
      }: {
        id: string;
        username?: string;
        email?: string;
        password?: string;
        roleId?: string;
      },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      if (user.id !== id)
        throw new GraphError("FORBIDDEN", {
          message: "You can only update your own account",
        });

      const updatedUser = await Models("user")
        .findByIdAndUpdate(
          id,
          { username, email, password, role: roleId, updatedBy: user.id },
          { new: true }
        )
        .populate("role createdBy updatedBy");
      return updatedUser;
    },
    deleteUser: async (
      _: any,
      { id }: { id: string },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      if (user.id !== id)
        throw new GraphError("FORBIDDEN", {
          message: "You can only delete your own account",
        });

      return await Models("user").findByIdAndDelete(id);
    },
  },
};

export default userResolvers;
