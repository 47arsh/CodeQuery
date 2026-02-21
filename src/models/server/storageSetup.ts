import { Permission, Role } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {

  try {

    // try to fetch existing bucket
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage connected (bucket already exists)");

  } catch (error) {

    // if bucket not found → create it
    try {

      await storage.createBucket(
        questionAttachmentBucket,   // bucket id
        questionAttachmentBucket,   // bucket display name
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false,   // fileSecurity
        true     // enabled
      );

      console.log("Storage bucket created");

    } catch (createError) {

      console.error("Storage creation failed:", createError);

    }

  }

}
