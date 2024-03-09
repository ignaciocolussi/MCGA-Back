import * as mongoose from "mongoose";
import User from "../interfaces/user";

// email must be unique
const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: { type: String, unique: true },
  password: String,
});

const UserModel = mongoose.model<User & mongoose.Document>("User", UserSchema);

export default UserModel;
