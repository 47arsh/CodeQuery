import { Permission, Role } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";
import { IndexType } from "node-appwrite";

export default async function createQuestionCollection() {
  try {

    // Create collection
    await databases.createCollection(
      db,
      questionCollection,
      "Questions",
      [
        Permission.read(Role.any()),      
        Permission.create(Role.users()),  
        Permission.update(Role.users()),  
        Permission.delete(Role.users()),
      ]
    );

    console.log("Question collection created");


    //Create attributes
    await Promise.all([

      databases.createStringAttribute(
        db,
        questionCollection,
        "title",
        200,
        true
      ),

      databases.createStringAttribute(
        db,
        questionCollection,
        "content",
        10000,
        true
      ),

      databases.createStringAttribute(
        db,
        questionCollection,
        "authorId",
        100,
        true
      ),

      // tags as ARRAY
      databases.createStringAttribute(
        db,
        questionCollection,
        "tags",
        50,
        false,
        undefined,
        true
      ),

      databases.createStringAttribute(
        db,
        questionCollection,
        "attachmentId",
        100,
        false
      ),

      // added useful production fields ↓

      databases.createIntegerAttribute(
        db,
        questionCollection,
        "voteCount",
        false,
        0
      ),

      databases.createIntegerAttribute(
        db,
        questionCollection,
        "answerCount",
        false,
        0
      ),

      databases.createIntegerAttribute(
        db,
        questionCollection,
        "viewCount",
        false,
        0
      ),

      databases.createStringAttribute(
        db,
        questionCollection,
        "status",
        20,
        false,
        "open"
      )

    ]);

    console.log(" Question attributes created");


    // Create indexes
    await Promise.all([

      // full-text search on title
      databases.createIndex(
        db,
        questionCollection,
        "title_fulltext",
        IndexType.Fulltext,
        ["title"]
      ),

      // search content too
      databases.createIndex(
        db,
        questionCollection,
        "content_fulltext",
        IndexType.Fulltext,
        ["content"]
      ),

      // sort by votes
      databases.createIndex(
        db,
        questionCollection,
        "vote_sort",
        IndexType.Key,
        ["voteCount"]
      )

    ]);

    console.log("Question indexes created");

  } catch (err) {
    console.error("Error creating Question collection:", err);
  }
}
