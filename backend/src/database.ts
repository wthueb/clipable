import mongoose from "mongoose";

export async function connect(connectionString: string) {
  console.debug(`connecting to database: ${connectionString}`);
  await mongoose.connect(connectionString);
}

export interface IUser {
  username: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);

export interface IClip {
  key: string;
  name: string;
  createdBy: IUser;
  createdAt: Date;
  filename: string;
}

const ClipSchema = new mongoose.Schema<IClip>({
  key: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: UserSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

export const Clip = mongoose.model<IClip>("Clip", ClipSchema);
