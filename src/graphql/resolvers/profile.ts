import { GraphError } from "../../lib";
import Models from "../../models";

const profileResolvers = {
  Query: {
    profiles: async (_: any, __: any, { user }: { user?: any }) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      return await Models("profile")
        .find()
        .populate("user createdBy updatedBy");
    },
    profile: async (
      _: any,
      { id }: { id: string },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      return await Models("profile")
        .findById(id)
        .populate("user createdBy updatedBy");
    },
  },
  Mutation: {
    createProfile: async (
      _: any,
      {
        userId,
        firstName,
        lastName,
        avatar,
        bio,
      }: {
        userId: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        bio?: string;
      },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });
      if (user.id !== userId)
        throw new GraphError("FORBIDDEN", {
          message: "You can only create a profile for yourself",
        });
      const existingProfile = await Models("profile").findOne({ userId });
      if (existingProfile)
        throw new GraphError("FORBIDDEN", { message: "Profile already exist" });

      const _profile = {
        userId,
        firstName,
        lastName,
        avatar,
        bio,
        createdBy: user.id,
        updatedBy: user.id,
      };
      const profile = await Models("profile").create(_profile);
      return await Models("profile")
        .findById(profile.id)
        .populate("createdBy updatedBy");
    },
    updateProfile: async (
      _: any,
      {
        id,
        firstName,
        lastName,
        avatar,
        bio,
      }: {
        id: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
        bio?: string;
      },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });

      const profile = await Models("profile").findById(id);
      if (!profile) throw new Error("Profile not found");
      if (profile.userId.toString() !== user.id)
        throw new GraphError("FORBIDDEN", {
          message: "You can only update your own profile",
        });

      const updatedProfile = await Models("profile")
        .findByIdAndUpdate(
          id,
          { firstName, lastName, avatar, bio, updatedBy: user.id },
          { new: true }
        )
        .populate("createdBy updatedBy");
      return updatedProfile;
    },
    deleteProfile: async (
      _: any,
      { id }: { id: string },
      { user }: { user?: any }
    ) => {
      if (!user)
        throw new GraphError("UNAUTHORIZED", {
          message: "You must be logged in to perform this action",
        });

      const profile = await Models("profile").findById(id);
      if (!profile) throw new Error("Profile not found");
      if (profile.userId.toString() !== user.id)
        throw new GraphError("FORBIDDEN", {
          message: "You can only delete your own profile",
        });

      return await Models("profile").findByIdAndDelete(id);
    },
  },
};

export default profileResolvers;
