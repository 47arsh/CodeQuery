import { IndexType, Permission, Role } from "node-appwrite";
import { answerCollection, db } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {

  // Create collection
  try {
    await databases.createCollection(db, answerCollection, answerCollection, [
      Permission.create(Role.users()),
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]);
    console.log("Answer Collection Created");
  } catch (e:any) {
    if (e?.code !== 409) throw e;
  }

  // Create attributes
  try {
    await Promise.all([
      databases.createStringAttribute(db, answerCollection, "content", 10000, true),
      databases.createStringAttribute(db, answerCollection, "questionId", 50, true),
      databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
    ]);
    console.log("Answer Attributes Created");
  } catch (e:any) {
    if (e?.code !== 409) throw e;
  }
  // was getting error here so i gotta stop a bot while attribute creation is being processed
  await new Promise(r => setTimeout(r, 1500));

  // Create indexes
  try {
    await Promise.all([
      databases.createIndex(db, answerCollection, "content_index", IndexType.Fulltext, ["content"]),
      databases.createIndex(db, answerCollection, "question_lookup", IndexType.Key, ["questionId"]),
      databases.createIndex(db, answerCollection, "author_lookup", IndexType.Key, ["authorId"]),
    ]);
    console.log("Answer Indexes Created");
  } catch (e:any) {
    if (e?.code !== 409) throw e;
  }

}