import { storage } from "./config";
import { Permission, Role } from "node-appwrite";
import { questionAttachmentBucket } from "../name";

export default async function createStorageBucket() {

  try {

    await storage.createBucket(
      questionAttachmentBucket,     // bucket id from name.ts
      "question-attachments",       // display name in Appwrite dashboard
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false,   // fileSecurity: use bucket-level permissions
      true     // enabled: allow uploads
    );

    console.log("Storage bucket created");

  } catch (err) {

    console.error("Storage bucket error:", err);

  }

}
