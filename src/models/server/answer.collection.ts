import { Permission, Role, IndexType } from "node-appwrite";
import { databases } from "./config";
import { db, answerCollection } from "../name";

export default async function createAnswerCollection() {
  try {

    // 1️ Create collection
    await databases.createCollection(
      db,
      answerCollection,
      "Answers",
      [
        Permission.read(Role.any()),      // anyone can read answers
        Permission.create(Role.users()),  // logged users can answer
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log("✅ Answer collection created");


    // 2️ Create attributes
    await Promise.all([

      // main answer text
      databases.createStringAttribute(
        db,
        answerCollection,
        "content",
        10000,
        true
      ),

      // which user posted answer
      databases.createStringAttribute(
        db,
        answerCollection,
        "authorId",
        100,
        true
      ),

      // which question this answer belongs to
      databases.createStringAttribute(
        db,
        answerCollection,
        "questionId",
        100,
        true
      ),

      // optional attachment (image/file)
      databases.createStringAttribute(
        db,
        answerCollection,
        "attachmentId",
        100,
        false
      ),

      // vote count for ranking answers
      databases.createIntegerAttribute(
        db,
        answerCollection,
        "voteCount",
        false,
        0
      ),

      // accepted answer flag
      databases.createBooleanAttribute(
        db,
        answerCollection,
        "isAccepted",
        false,
        false
      )

    ]);

    console.log("Answer attributes created");


    // 3️ Create indexes
    await Promise.all([

      // search answers by text
      databases.createIndex(
        db,
        answerCollection,
        "content_fulltext",
        IndexType.Fulltext,
        ["content"]
      ),

      // fast lookup of answers for a question
      databases.createIndex(
        db,
        answerCollection,
        "question_lookup",
        IndexType.Key,
        ["questionId"]
      ),

      // sorting answers by votes
      databases.createIndex(
        db,
        answerCollection,
        "vote_sort",
        IndexType.Key,
        ["voteCount"]
      )

    ]);

    console.log("Answer indexes created");

  } catch (err) {
    console.error(" Error creating Answer collection:", err);
  }
}
