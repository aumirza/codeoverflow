import { voteCollection, db } from "@/config/db";
import { databases } from "./config";
import { Permission } from "node-appwrite";

export default async function createVoteCollection() {
  //
  await databases.createCollection(db, voteCollection, voteCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Comment collection created");

  await Promise.all([
    databases.createEnumAttribute(
      db,
      voteCollection,
      "type",
      ["question", "answer"],
      true
    ),
    databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
    databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
    databases.createEnumAttribute(
      db,
      voteCollection,
      "voteStatus",
      ["up", "down"],
      true
    ),
  ]);

  console.log("Comment collection attributes created");
}
