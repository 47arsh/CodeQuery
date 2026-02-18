import { Client, Databases, Storage, Users , Avatars } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string); // server-only secret key

export const databases = new Databases(client);
export const storage = new Storage(client);
export const users = new Users(client);
export const avatars = new Avatars(client);

export default client;
