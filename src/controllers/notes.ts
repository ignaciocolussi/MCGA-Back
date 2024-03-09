import express from "express";
import { CustomRequest } from "../interfaces/request";
import Note from "../interfaces/note";
import NoteModel from "../models/note";
import TagModel from "../models/tag";

class NotesController {
  public getAllNotesCount = async (
    request: CustomRequest,
    response: express.Response
  ): Promise<express.Response> => {
    var notesCount = await NoteModel.estimatedDocumentCount();

    return response.status(200).json({
      count: notesCount,
    });
  };

  public getAllNotes = async (
    request: CustomRequest,
    response: express.Response
  ): Promise<express.Response> => {
    var notes = await NoteModel.find({ owner: request.user._id }).populate(
      "tags",
      "-__v"
    );

    return response.status(200).json({
      count: notes.length,
      data: notes,
    });
  };

  public getNoteById = async (
    request: express.Request,
    response: express.Response
  ): Promise<express.Response> => {
    const noteId = request.params.id;

    if (!noteId) {
      response.status(400).json("Missing id");
      return;
    }

    var note = await NoteModel.findById(noteId).populate("tags", "-__v");

    if (!note) {
      response.status(404).json("Note not found");
      return;
    }

    return response.status(200).json(note);
  };

  public createNote = async (
    request: CustomRequest,
    response: express.Response
  ): Promise<express.Response> => {
    const noteData: Note = request.body;

    var createdNote = new NoteModel();

    if (!noteData.title) {
      response.status(400).json("Title is required");
      return;
    }

    if (!noteData.content) {
      response.status(400).json("Content is required");
      return;
    }

    // if (!noteData.tags) {
    //   response.status(400).json("Tags is required");
    //   return;
    // }

    if (noteData.archived === null || noteData.archived === undefined) {
      noteData.archived = false;
    }

    createdNote.title = noteData.title;
    createdNote.content = noteData.content;
    createdNote.tags = [];
    createdNote.archived = noteData.archived;
    createdNote.created = new Date();
    createdNote.owner = request.user._id;

    for (const noteTag of noteData.tags) {
      if (!noteTag.text) {
        return response.status(400).json("Tag text is required");
        return;
      }
      if (noteTag.text.length > 8) {
        return response.status(400).json("Tag text is too long");
        return;
      }
      if (!noteTag.color) {
        return response.status(400).json("Tag color is required");
        return;
      }

      if (
        !noteTag.color.match(/^#([0-9a-f]{3}){1,2}$/i) ||
        noteTag.color.length > 7 ||
        noteTag.color.length < 4
      ) {
        return response
          .status(400)
          .json(`Tag color "${noteTag.color}" is invalid`);
        return;
      }

      if (noteTag.text.length > 20) {
        return response
          .status(400)
          .json(`Tag text ${noteTag.text} is too long`);
        return;
      }

      if (noteTag.text.length < 1) {
        return response
          .status(400)
          .json(`Tag text ${noteTag.text} is too short`);
        return;
      }

      const tags = await TagModel.find({ text: noteTag.text }); // TODO: check owner

      if (tags.length > 0) {
        createdNote.tags.push(tags[0]._id);
      } else {
        let createdTag = new TagModel(noteTag);
        createdTag.owner = request.user._id;
        const savedTag = await createdTag.save();
        createdNote.tags.push(savedTag._id);
      }
    }

    let res = await createdNote.save();
    await res.populate("tags", "-_id -__v");
    return response.status(201).json(res);
  };

  public updateNote = async (
    request: express.Request,
    response: express.Response
  ): Promise<express.Response> => {
    const noteData: Note = request.body;
    const noteId = request.params.id;

    if (!noteId) {
      return response.status(400).json("Missing id");
    }

    if (!noteData.title) {
      return response.status(400).json("Title is required");
    }

    if (!noteData.content) {
      return response.status(400).json("Content is required");
    }

    // if (!noteData.tags) {
    //   response.status(400).json("Tags is required");
    //   return;
    // }

    if (noteData.archived === null || noteData.archived === undefined) {
      noteData.archived = false;
    }

    // TODO: CREATE TAGS IF NOT EXISTS OR UPDATE IF EXISTS
    let res = await NoteModel.findByIdAndUpdate(noteId, noteData, {
      new: true,
    });

    await res.populate("tags", "-_id -__v");
    return response.status(200).json(res);
  };

  public deleteNote = async (
    request: express.Request,
    response: express.Response
  ): Promise<express.Response> => {
    const noteId = request.params.id;
    if (!noteId) {
      return response.status(400).json("Missing id");
    }

    await NoteModel.findByIdAndDelete(noteId);
    return response.status(200).json("Note deleted");
  };
}

export default NotesController;
