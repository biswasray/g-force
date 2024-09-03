export const typeDefs = `#graphql
  type Role {
    id: ID!
    name: String!
    description: String!
    createdAt: String!
    createdBy: User!
    updatedAt: String!
    updatedBy: User!
  }

  type Avatar {
    id: ID!
    name: String!
    link: String!
    description: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    roleId: ID!
    role: Role!
    profile: Profile
    createdAt: String!
    createdBy: User
    updatedAt: String!
    updatedBy: User
  }

  type Profile {
    id: ID!
    userId: ID!
    user: User!
    firstName: String!
    lastName: String!
    avatar: String
    bio: String
    createdAt: String!
    createdBy: User!
    updatedAt: String!
    updatedBy: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    avatars: [Avatar!]!
    roles: [Role!]!
    role(id: ID!): Role!
    users: [User!]!
    user(id: ID!): User!
    profiles: [Profile!]!
    profile(id: ID!): Profile!
    me: User
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!, roleId: ID!): AuthPayload!
    signIn(email: String!, password: String!): AuthPayload!

    createRole(name: String!, description: String!): Role!
    updateRole(id: ID!, name: String, description: String): Role!
    deleteRole(id: ID!): Role!

    updateUser(id: ID!, username: String, email: String, password: String, roleId: ID): User!
    deleteUser(id: ID!): User!

    createProfile(userId: ID!, firstName: String!, lastName: String!, avatar: String, bio: String): Profile!
    updateProfile(id: ID!, firstName: String, lastName: String, avatar: String, bio: String): Profile!
    deleteProfile(id: ID!): Profile!
  }
`;
