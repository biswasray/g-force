import { ProfileModel } from "./profile";
import { RoleModel } from "./role";
import { UserModel } from "./user";

const models = {
  role: RoleModel,
  user: UserModel,
  profile: ProfileModel,
} as const;

function modelSelector<K extends keyof typeof models>(
  key: K
): (typeof models)[K] {
  return models[key];
}

const Models = Object.assign(modelSelector, {});

export default Models;
