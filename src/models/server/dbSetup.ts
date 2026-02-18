import { db } from "../name";

import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import getOrCreateStorage from "./storage.collection";

import { databases } from "./config";

export default async function getOrCreateDB() {

  try {

    // try connecting to database
    await databases.get(db);
    console.log("Database connection");

  } catch (error) {

    try {

      // create database if missing
      await databases.create(db, db);
      console.log("Database created");

      // after creating DB, create collections in parallel
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createVoteCollection(),
        createCommentCollection(),
        getOrCreateStorage()
      ]);

      console.log("Collections and storage created");
      console.log("Database connected");

    } catch (createError) {

      console.error("Database setup failed:", createError);

    }

  }
  return databases;
}
