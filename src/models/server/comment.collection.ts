import { commentCollection, db } from "@/config/db";
import { database } from "./config";
import { Permission } from "node-appwrite";

export default async function createCommentCollection() {
  //
  await database.createCollection(db, commentCollection, commentCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);

  console.log("Comment collection created");

  await Promise.all([
    database.createStringAttribute(db, commentCollection, "content", 500, true),
    database.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["question", "answer"],
      true
    ),
    database.createStringAttribute(db, commentCollection, "typeId", 50, true),
    database.createStringAttribute(db, commentCollection, "authorId", 50, true),
  ]);

  console.log("Comment collection attributes created");
}
