import { Permission } from "node-appwrite";
import { db, answerCollection } from "@/config/db";
import { database } from "./config";

export default async function createAnswerCollection() {
  await database.createCollection(db, answerCollection, answerCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.create("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ]);
  console.log("Answer collection created");

  await Promise.all([
    database.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true
    ),
    database.createStringAttribute(db, answerCollection, "authorId", 50, true),
    database.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      50,
      true
    ),
  ]);
  console.log("Answer collection attributes created");
}
