import { Permission, Role, IndexType } from "node-appwrite";
import { databases } from "./config";
import { db, voteCollection } from "../name";

export default async function createVoteCollection() {

  try {

    // Create collection
    await databases.createCollection(
      db,
      voteCollection,
      "Votes",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log("Vote collection created");


    // Create attributes
    await Promise.all([

      // Which user voted
      databases.createStringAttribute(
        db,
        voteCollection,
        "userId",
        100,
        true
      ),

      // Which item was voted on
      databases.createStringAttribute(
        db,
        voteCollection,
        "targetId",
        100,
        true
      ),

      // "question" OR "answer"
      databases.createStringAttribute(
        db,
        voteCollection,
        "targetType",
        20,
        true
      ),

      // +1 OR -1
      databases.createIntegerAttribute(
        db,
        voteCollection,
        "value",
        true
      )

    ]);

    console.log("Vote attributes created");


    // Create indexes
    await Promise.all([

      // fast lookup of votes for item
      databases.createIndex(
        db,
        voteCollection,
        "target_lookup",
        IndexType.Key,
        ["targetId"]
      ),

      // fast lookup of votes by user
      databases.createIndex(
        db,
        voteCollection,
        "user_lookup",
        IndexType.Key,
        ["userId"]
      )

    ]);

    console.log("Vote indexes created");

  } catch (err) {

    console.error("Vote collection error:", err);

  }

}
