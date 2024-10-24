import { db, voteCollection } from "@/config/db";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { voteStatus, type, typeId, votedById } = await req.json();

    const votes = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);

    // if vote exist
    if (votes.total) {
      // if vote exist and user want to change the votestatus only
      const isOppositeVote = votes.documents[0].voteStatus !== voteStatus;
      if (isOppositeVote) {
        await databases.updateDocument(
          db,
          voteCollection,
          votes.documents[0].$id,
          { voteStatus }
        );
      }
      // if vote exist and user want to remove vote, decrease reputation
      else {
        await databases.deleteDocument(
          db,
          voteCollection,
          votes.documents[0].$id
        );
        // decrease the reputation
        const user = await users.getPrefs(votedById);
        await users.updatePrefs(votedById, { reputation: user.reputation - 1 });
      }
    }
    //else if vote not exist create vote and increase reputation
    else {
      await databases.createDocument(db, voteCollection, ID.unique(), {
        voteStatus,
        type,
        typeId,
        votedById,
      });
      // increase the reputation
      const user = await users.getPrefs(votedById);
      await users.updatePrefs(votedById, { reputation: user.reputation + 1 });
    }

    // get total vote count and group by voteStatus [upvotes,downvotes]
    const upvotes = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("voteStatus", "up"),
      Query.limit(1),
    ]);

    const downvotes = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("voteStatus", "down"),
      Query.limit(1),
    ]);

    return NextResponse.json({
      success: true,
      message: "Vote successful",
      data: {
        upvotes: upvotes.total,
        downvotes: downvotes.total,
        netCount: upvotes.total - downvotes.total,
      },
      status: 200,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Error occured while voting.",
      },
      {
        status: err?.status || err?.code || 500,
      }
    );
  }
}
