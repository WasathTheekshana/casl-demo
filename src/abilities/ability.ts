import { MongoAbility, InferSubjects, defineAbility } from "@casl/ability";
import { IUser } from "../models/user.model";
import { IPost } from "../models/post.model";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects = InferSubjects<IPost | IUser> | "all";
export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const defineAbilityFor = (user: IUser) => {
  return defineAbility((can) => {
    if (user.role === "admin") {
      can("manage", "all");
    } else {
      // Regular users
      can("read", "Post");
      can(["create", "update", "delete"], "Post", { author: user._id });
      can("read", "User", { _id: user._id });
      can("update", "User", { _id: user._id });
    }
  });
};
