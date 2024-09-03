import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { getCurrentDate } from "../utils";

export interface IRole extends Document<ObjectId> {
  name: string;
  description: string;
  createdAt: Date;
  createdBy: ObjectId;
  updatedAt: Date;
  updatedBy: ObjectId;
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: getCurrentDate },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  updatedAt: { type: Date, default: getCurrentDate },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
});

RoleSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = getCurrentDate();
  }
  next();
});

export const RoleModel = mongoose.model<IRole>("Role", RoleSchema);
