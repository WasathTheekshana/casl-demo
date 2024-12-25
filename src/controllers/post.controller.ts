import { Request, Response, RequestHandler } from "express";
import { Post } from "../models/post.model";
import { defineAbilityFor } from "../abilities/ability";
import { subject } from "@casl/ability";

export const createPost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const ability = defineAbilityFor(req.user);

    if (ability.can("create", "Post")) {
      const post = new Post({
        ...req.body,
        author: req.user._id,
      });
      await post.save();
      res.status(201).json(post);
    } else {
      res.status(403).json({ message: "forbidden!" });
    }
  } catch (error) {
    res.status(500).json({ message: "error creating post!" });
  }
};

export const updatePost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "post not found!" });
    }

    const ability = defineAbilityFor(req.user);

    if (ability.can("update", subject("Post", post!.toObject()))) {
      Object.assign(post!, req.body);
      await post!.save();
      res.json(post);
    } else {
      res.status(403).json({ message: "forbidden!" });
    }
  } catch (error) {
    res.status(500).json({ message: "error updating post!" });
  }
};
