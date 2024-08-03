import { voteCollection, db } from "@/config/db";
import { database } from "./config";
import { Permission } from "node-appwrite";

export default async function createVoteCollection() {
  //
  await database.createCollection(db, voteCollection, voteCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Comment collection created");

  await Promise.all([
    database.createEnumAttribute(
      db,
      voteCollection,
      "type",
      ["question", "answer"],
      true
    ),
    database.createStringAttribute(db, voteCollection, "typeId", 50, true),
    database.createStringAttribute(db, voteCollection, "votedById", 50, true),
    database.createEnumAttribute(
      db,
      voteCollection,
      "voteStatus",
      ["up", "down"],
      true
    ),
  ]);

  console.log("Comment collection attributes created");
}
