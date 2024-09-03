import { GraphError } from "../../lib";
import Models from "../../models";

const roleResolvers = {
  Query: {
    roles: async (_: any, __: any, { user }: { user?: any }) => {
      //   if (!user)
      //     throw new AuthenticationError(
      //       "You must be logged in to perform this action"
      //     );
      return await Models("role").find().populate("createdBy updatedBy");
    },
    role: async (_: any, { id }: { id: string }, { user }: { user?: any }) => {
      //   if (!user)
      //     throw new AuthenticationError(
      //       "You must be logged in to perform this action"
      //     );
      return await Models("role").findById(id).populate("createdBy updatedBy");
    },
  },
  Mutation: {
    createRole: async (
      _: any,
      { name, description }: { name: string; description: string },
      { user }: { user?: any }
    ) => {
      //   if (!user)
      //     throw new AuthenticationError(
      //       "You must be logged in to perform this action"
      //     );
      // Add additional check for admin role if needed
      const _role = {
        name,
        description,
        createdBy: user?.id || null,
        updatedBy: user?.id || null,
      };
      const role = await Models("role").create(_role);
      return await Models("role")
        .findById(role.id)
        .populate("createdBy updatedBy");
    },
    updateRole: async (
      _: any,
      {
        id,
        name,
        description,
      }: { id: string; name?: string; description?: string },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      // Add additional check for admin role if needed
      const updatedRole = await Models("role")
        .findByIdAndUpdate(
          id,
          { name, description, updatedBy: user.id },
          { new: true }
        )
        .populate("createdBy updatedBy");
      return updatedRole;
    },
    deleteRole: async (
      _: any,
      { id }: { id: string },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      // Add additional check for admin role if needed
      return await Models("role").findByIdAndDelete(id);
    },
  },
};

export default roleResolvers;
