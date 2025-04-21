import { db } from "@/config/db";
import { databases } from "./config";
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createVoteCollection from "./vote.collection";
import createCommentCollection from "./comment.collection";
import { Databases, Models } from "node-appwrite";

export default async function getOrCreateDB(): Promise<Databases> {
  try {
    // Check if the database exists
    const existingDatabases: Models.DatabaseList = await databases.list();
    const existingDB = existingDatabases.databases.find(
      (database) => database.$id === db
    );

    if (existingDB) {
      console.log("Database connection established.");
    } else {
      // Create a new database if it doesn't exist
      await databases.create(db, db);
      console.log("Database created successfully.");

      // Create required collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createVoteCollection(),
        createCommentCollection(),
      ]);
      console.log("Database collections created.");
    }
  } catch (error: any) {
    if (error.code === 403) {
      console.error(
        "Database limit reached. Consider upgrading your plan.",
        error
      );
    } else if (error.code === 409) {
      console.error("A database with the same ID already exists.", error);
    } else {
      console.error(
        "An error occurred while getting or creating the database.",
        error
      );
    }
  }

  return databases;
}
