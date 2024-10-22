import { account, avatars, databases, storage } from "@/models/client";
import {
  db,
  questionAttachmentsBucket,
  questionCollection,
  voteCollection,
} from "@/config/db";
import { ID, Models, Query } from "appwrite";

interface IComment extends Models.Document {
  content: string;
  type: string;
  typeId: string;
  authorId: string;
}

interface IVote extends Models.Document {
  type: string;
  typeId: string;
  votedById: string;
  voteStatus: number;
}

interface IQuestion extends Models.Document {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId: string;
  answers: Models.DocumentList<IAnswer>;
}

interface IAnswer extends Models.Document {
  content: string;
  questionId: string;
  authorId: string;
}

export const useDb = () => ({ createQuestion, getQuestions, getQuestion });

const fetchUserDetails = async (userId: string) => {
  try {
    const user = await account.get();
    const avatarImage = avatars.getInitials(user?.name);
    return { ...user, avatar: avatarImage };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

async function getAnswers(QuestionId: string) {
  try {
    const answers = await databases.listDocuments<IAnswer>(db, "answers", [
      Query.equal("questionId", QuestionId),
    ]);
    answers.documents = await Promise.all(
      answers.documents.map(async (answer) => {
        const user = await fetchUserDetails(answer.authorId);
        const comments = await getComments("answer", answer.$id);
        return {
          ...answer,
          author: user,
          comments: comments,
        };
      })
    );
    return answers;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getComments(type: string, typeId: string) {
  try {
    const comments = await databases.listDocuments<IComment>(db, "comments", [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
    ]);
    comments.documents = await Promise.all(
      comments.documents.map(async (comment) => {
        const user = await fetchUserDetails(comment.authorId);
        return {
          ...comment,
          author: user,
        };
      })
    );
    return comments;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getVotes(type: string, typeId: string) {
  try {
    const votes = await databases.listDocuments<IVote>(db, voteCollection, [
      Query.equal("type", type), // Filter by type
      Query.equal("typeId", typeId),
      // Query.limit(1),
    ]);
    return votes;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getQuestion(id: string) {
  try {
    console.log("fetching question from database");
    const question = await databases.getDocument<IQuestion>(
      db,
      questionCollection,
      id
    );
    const author = await fetchUserDetails(question.authorId);
    const votes = await getVotes("question", question.$id);
    const comments = await getComments("question", question.$id);
    const answers = await getAnswers(question.$id);
    const attachment =
      question.attachmentId !== ""
        ? await getAttachment(question.attachmentId)
        : null;
    return {
      ...question,
      author: author,
      votes: votes,
      comments: comments,
      answers: answers,
      attachment: attachment,
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getQuestions() {
  try {
    const questions = await databases.listDocuments<IQuestion>(
      db,
      questionCollection
    );

    questions.documents = await Promise.all(
      questions.documents.map(async (doc) => {
        const author = await fetchUserDetails(doc.authorId);
        const votes = await getVotes("question", doc.$id);
        const answers = await databases.listDocuments<IAnswer>(db, "answers", [
          Query.equal("questionId", doc.$id),
          Query.limit(1),
        ]);
        return {
          ...doc,
          author: author,
          totalVotes: votes.total,
          totalAnswers: answers.total,
        };
      })
    );
    return questions;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function uploadAttachment(file: File) {
  try {
    const storageRes = await storage.createFile(
      questionAttachmentsBucket,
      ID.unique(),
      file
    );
    if (storageRes.$id === undefined) throw new Error("Storage error");
    return storageRes.$id;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getAttachment(attachmentId: string) {
  try {
    const file = storage.getFilePreview(
      questionAttachmentsBucket,
      attachmentId
    );
    console.log(file);
    return file;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function createQuestion(
  title: string,
  content: string,
  authorId: string,
  tags: string[],
  file: File
) {
  try {
    const attachmentId = await uploadAttachment(file);
    const question = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: title,
        content: content,
        tags: tags,
        attachmentId: attachmentId,
        authorId: authorId,
      }
    );
    return question;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
