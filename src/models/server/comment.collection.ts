import { Permission, Role, IndexType } from "node-appwrite";
import { databases } from "./config";
import { db, commentCollection } from "../name";

export default async function createCommentCollection() {

  try {

    // create collection
    await databases.createCollection(
      db,
      commentCollection,
      "Comments",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log("Comment collection created");


    // create attributes
    await Promise.all([

      // actual comment text
      databases.createStringAttribute(
        db,
        commentCollection,
        "content",
        1000,
        true
      ),

      // who wrote the comment
      databases.createStringAttribute(
        db,
        commentCollection,
        "authorId",
        100,
        true
      ),

      // id of question or answer this belongs to
      databases.createStringAttribute(
        db,
        commentCollection,
        "targetId",
        100,
        true
      ),

      // "question" or "answer"
      databases.createStringAttribute(
        db,
        commentCollection,
        "targetType",
        20,
        true
      )

    ]);

    console.log("Comment attributes created");


    // indexes for faster lookup

    await Promise.all([

      // fetch all comments for a question/answer
      databases.createIndex(
        db,
        commentCollection,
        "target_lookup",
        IndexType.Key,
        ["targetId"]
      ),

      // fetch comments by user if needed
      databases.createIndex(
        db,
        commentCollection,
        "author_lookup",
        IndexType.Key,
        ["authorId"]
      )

    ]);

    console.log("Comment indexes created");

  } catch (err) {

    console.error("Comment collection error:", err);

  }

}
