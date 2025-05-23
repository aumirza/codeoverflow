import { avatars, databases, storage } from "@/models/client";
import {
  db,
  questionAttachmentsBucket,
  questionCollection,
  voteCollection,
} from "@/config/db";
import { ID, Query } from "appwrite";
import { IAnswer, IComment, IQuestion, IVote } from "@/types/models";
import { users } from "@/models/server/config";

export const useDb = () => ({
  createQuestion,
  getQuestions,
  getQuestionIncluded,
  addNewComment,
  updateComment,
  deleteComment,
  createAnswer,
  createOrUpdateVote,
  isVotedByOnType,
  getQuestion,
  updateQuestion,
});

const fetchUserDetails = async (userId: string) => {
  try {
    const user = await users.get(userId);
    const avatarImage = avatars.getInitials(user?.name);
    return { ...user, avatar: avatarImage.toString() };
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
        const votes = await getVotes("answer", answer.$id);
        return {
          ...answer,
          author: user,
          comments: comments,
          votes: votes,
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
        const author = await fetchUserDetails(comment.authorId);
        return {
          ...comment,
          author: author,
        };
      })
    );
    return comments;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function addNewComment(
  content: string,
  type: string,
  typeId: string,
  authorId: string
) {
  try {
    const newComment = await databases.createDocument<IComment>(
      db,
      "comments",
      ID.unique(),
      {
        content: content,
        type: type,
        typeId: typeId,
        authorId: authorId,
      }
    );
    return newComment;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function updateComment(content: string, commentId: IComment["$id"]) {
  try {
    const updatedComment = await databases.updateDocument<IComment>(
      db,
      "comments",
      commentId,
      {
        content: content,
      }
    );
    return updatedComment;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function deleteComment(commentId: string) {
  try {
    const deletedComment = await databases.deleteDocument(
      db,
      "comments",
      commentId
    );
    return deletedComment;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getVotes(type: string, typeId: string) {
  try {
    const upvotes = await databases.listDocuments<IVote>(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("voteStatus", "up"),
      Query.limit(1),
    ]);

    const downvotes = await databases.listDocuments<IVote>(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("voteStatus", "down"),
      Query.limit(1),
    ]);
    return {
      upvotes: upvotes.total,
      downvotes: downvotes.total,
      total: upvotes.total + downvotes.total,
      net: upvotes.total - downvotes.total,
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getQuestion(id: string) {
  try {
    const question = await databases.getDocument<IQuestion>(
      db,
      questionCollection,
      id
    );
    const attachment =
      question.attachmentId !== ""
        ? await getAttachment(question.attachmentId)
        : null;
    return { ...question, attachment: attachment };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getQuestionIncluded(id: string) {
  try {
    const question = await getQuestion(id);
    const author = await fetchUserDetails(question.authorId);
    const votes = await getVotes("question", question.$id);
    const comments = await getComments("question", question.$id);
    const answers = await getAnswers(question.$id);

    return {
      ...question,
      author: author,
      votes: votes,
      comments: comments,
      answers: answers,
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getQuestions({
  searchQuery,
  pageNo,
  limit,
}: {
  searchQuery?: string;
  pageNo?: number;
  limit?: number;
}) {
  const perPage = limit ?? 10;
  const page = pageNo ?? 1;
  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * perPage),
    Query.limit(perPage),
  ];
  if (searchQuery) {
    // only search title
    // queries.push(Query.search("title", searchQuery));
    // search title and content both
    queries.push(
      Query.or([
        Query.search("title", searchQuery),
        Query.search("content", searchQuery),
      ])
    );
  }

  try {
    const questions = await databases.listDocuments<IQuestion>(
      db,
      questionCollection,
      queries
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
    return file.toString();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function updateAttachment(attachmentId: string, file: File) {
  try {
    //delete old attachment
    await storage.deleteFile(questionAttachmentsBucket, attachmentId);
    //upload new attachment
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

async function createQuestion(
  title: string,
  content: string,
  authorId: string,
  tags: string[],
  file?: File
) {
  try {
    let attachmentId = "";
    if (file) attachmentId = await uploadAttachment(file);
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
async function updateQuestion(
  id: string,
  title: string,
  content: string,
  tags: string[],
  attachmentId?: string,
  file?: File
) {
  try {
    const data = {
      title: title,
      content: content,
      tags: tags,
    } as {
      title: string;
      content: string;
      tags: string[];
      attachmentId?: string;
    };

    if (file) {
      if (!attachmentId || attachmentId === "") {
        data.attachmentId = await uploadAttachment(file);
      } else {
        data.attachmentId = await updateAttachment(attachmentId, file);
      }
    } else {
      if (attachmentId && attachmentId !== "") {
        await storage.deleteFile(questionAttachmentsBucket, attachmentId);
        data.attachmentId = "";
      }
    }

    const question = await databases.updateDocument(
      db,
      questionCollection,
      id,
      data
    );
    return question;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function createAnswer(
  content: string,
  authorId: string,
  questionId: string
) {
  try {
    const res = await fetch("/api/answer", {
      method: "Post",
      body: JSON.stringify({
        content: content,
        authorId: authorId,
        questionId: questionId,
      }),
    });
    const answer = await res.json();
    return answer.data;
  } catch (error) {
    // handle request error
    console.error(error);
    return Promise.reject(error);
  }
}

async function createOrUpdateVote(
  voteStatus: "up" | "down",
  type: "question" | "answer",
  typeId: string,
  votedById: string
) {
  try {
    const res = await fetch("/api/vote", {
      method: "Post",
      body: JSON.stringify({
        voteStatus: voteStatus,
        type: type,
        typeId: typeId,
        votedById: votedById,
      }),
    });
    const vote_json = await res.json();
    if (!vote_json.success) throw new Error(vote_json.message);
    return vote_json;
  } catch (error) {
    // handle request error
    console.error(error);
    return Promise.reject(error);
  }
}

async function isVotedByOnType(
  type: string,
  typeId: string,
  votedById: string
) {
  try {
    const res = await databases.listDocuments<IVote>(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
      Query.limit(1),
    ]);
    return {
      isVoted: res.documents.length > 0,
      vote: res.documents[0],
      isUpvote: res.documents[0]?.voteStatus === "up",
      isDownvote: res.documents[0]?.voteStatus === "down",
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
