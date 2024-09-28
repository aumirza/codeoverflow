import { db } from "@/config/db";
import { databases } from "./config";
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createVoteCollection from "./vote.collection";
import createCommentCollection from "./comment.collection";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database connection");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("Database Created");

      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createVoteCollection(),
        createCommentCollection(),
      ]);
      console.log("Database collections created");

      console.log("Database Connected");
    } catch (error) {
      console.log(
        "Error occured while getting or creating database or collection",
        error
      );
    }
  }
  return databases;
}
