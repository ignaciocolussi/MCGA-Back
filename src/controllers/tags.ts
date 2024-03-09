import express from "express";
import { CustomRequest } from "../interfaces/request";
import Tag from "../interfaces/tag";
import TagModel from "../models/tag";

class TagsController {
  public getAllTagsCount = async (
    request: CustomRequest,
    response: express.Response
  ): Promise<express.Response> => {
    var TagsCount = await TagModel.estimatedDocumentCount();

    return response.status(200).json({
      count: TagsCount,
    });
  };

  public getAllTags = async (
    request: CustomRequest,
    response: express.Response
  ): Promise<express.Response> => {
    var Tags = await TagModel.find({ owner: request.user._id });

    return response.status(200).json({
      count: Tags.length,
      data: Tags,
    });
  };

  public getTagById = async (
    request: express.Request,
    response: express.Response
  ): Promise<express.Response> => {
    const TagId = request.params.id;

    if (!TagId) {
      response.status(400).json("Missing id");
      return;
    }

    var Tag = await TagModel.findById(TagId);

    if (!Tag) {
      response.status(404).json("Tag not found");
      return;
    }

    return response.status(200).json(Tag);
  };

  public deleteTag = async (
    request: express.Request,
    response: express.Response
  ): Promise<express.Response> => {
    const TagId = request.params.id;
    if (!TagId) {
      response.status(400).json("Missing id");
      return;
    }
    try {
      var Tag = await TagModel.findByIdAndDelete(TagId);
      return response.status(200).json(Tag);
    } catch (error) {
      return response.status(500).json(error);
    }
  };

  public createTag = async (
    request: CustomRequest,
    response: express.Response
  ): Promise<express.Response> => {
    const { text, color } = request.body;
    if (!text || !color) {
      response.status(400).json("Missing text or color");
      return;
    }
    try {
      const Tag = new TagModel({
        text,
        color,
        owner: request.user._id,
      });
      await Tag.save();
      return response.status(200).json(Tag);
    } catch (error) {
      return response.status(500).json(error);
    }
  };
}
export default TagsController;
