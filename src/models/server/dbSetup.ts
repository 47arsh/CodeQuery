import { db } from "../name";
import { databases } from "./config";

import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import getOrCreateStorage from "./storageSetup";

export default async function getOrCreateDB() {

  // Ensure database exists
  try {
    await databases.get(db);
    console.log("Database connected");
  } catch {
    await databases.create(db, db);
    console.log("Database created");
  }

  // ALWAYS ensure collections
  await createQuestionCollection();
  await createAnswerCollection();
  await createVoteCollection();
  await createCommentCollection();

  // Ensure storage bucket
  await getOrCreateStorage();

  console.log("Backend ready");

  return databases;
}