import { Client, Account, Databases, Storage, Avatars } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

// Services you will use in the app
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export default client;
