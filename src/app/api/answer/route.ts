import { answerCollection, db } from "@/config/db";
import { databases, users } from "@/models/server/config";
import { IUserPrefs } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const { questionId, authorId, answer } = await request.json();

    const res = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId,
        questionId,
      }
    );

    // increase reputation
    const userPrefs = await users.getPrefs<IUserPrefs>(authorId);
    await users.updatePrefs(authorId, {
      reputation: userPrefs.reputation + 1,
    });

    return NextResponse.json({ data: res }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { answerId } = await req.json();
    const answer = await databases.getDocument(db, answerCollection, answerId);
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }
    const res = await databases.deleteDocument(db, answerCollection, answerId);
    const userPrefs = await users.getPrefs<IUserPrefs>(answer.authorId);
    await users.updatePrefs(answer.authorId, {
      reputation: userPrefs.reputation - 1,
    });
    return NextResponse.json({ data: res }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error Deleting answer",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}
