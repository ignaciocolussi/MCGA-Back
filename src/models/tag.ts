import * as mongoose from "mongoose";
import Tag from "../interfaces/tag";

const TagSchema = new mongoose.Schema({
  text: String,
  color: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const TagModel = mongoose.model<Tag & mongoose.Document>("Tag", TagSchema);

export default TagModel;
