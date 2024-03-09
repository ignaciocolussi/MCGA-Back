import * as mongoose from "mongoose";
import TagModel from "./tag";
import Note from "../interfaces/note";

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created: Date,
  updated: Date,
});

const NoteModel = mongoose.model<Note & mongoose.Document>("Note", NoteSchema);

export default NoteModel;
