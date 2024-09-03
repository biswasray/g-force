import mongoose, { Schema, Document, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { getCurrentDate } from "../utils";
import { IRole } from "./role";

export interface IUser extends Document<ObjectId> {
  username: string;
  email: string;
  password: string;
  roleId: ObjectId;
  role?: IRole;
  createdAt: Date;
  createdBy: IUser["_id"];
  updatedAt: Date;
  updatedBy: IUser["_id"];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  createdAt: { type: Date, default: getCurrentDate },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: getCurrentDate },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
