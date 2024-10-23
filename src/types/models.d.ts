import { Models } from "appwrite";

export interface IComment extends Models.Document {
  content: string;
  type: string;
  typeId: string;
  authorId: string;
}

export interface IVote extends Models.Document {
  type: string;
  typeId: string;
  votedById: string;
  voteStatus: number;
}

export interface IQuestion extends Models.Document {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  attachmentId: string;
  answers: Models.DocumentList<IAnswer>;
}

export interface IAnswer extends Models.Document {
  content: string;
  questionId: string;
  authorId: string;
}
