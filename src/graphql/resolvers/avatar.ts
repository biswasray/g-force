const avatarResolvers = {
  Query: {
    avatars: async (_: any, __: any, { user }: { user?: any }) => {
      return [
        {
          id: 1,
          name: "Friday",
          link: "/assets/images/avatars/a.jpg",
        },
        {
          id: 2,
          name: "John",
          link: "/assets/images/avatars/b.jpg",
        },
        {
          id: 3,
          name: "Silk",
          link: "/assets/images/avatars/c.jpg",
        },
        {
          id: 4,
          name: "Bob",
          link: "/assets/images/avatars/d.jpg",
        },
        {
          id: 5,
          name: "Cirila",
          link: "/assets/images/avatars/e.jpg",
        },
        {
          id: 6,
          name: "Max",
          link: "/assets/images/avatars/f.jpg",
        },
      ];
    },
  },
  Mutation: {},
};

export default avatarResolvers;
