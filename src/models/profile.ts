import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IProfile extends Document<ObjectId> {
  userId: ObjectId;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  createdBy: ObjectId;
  updatedAt: Date;
  updatedBy: ObjectId;
}

const ProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

ProfileSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

export const ProfileModel = mongoose.model<IProfile>("Profile", ProfileSchema);
