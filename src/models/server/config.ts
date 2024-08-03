import { appwrite_id, appwrite_key, appwrite_url } from "@/config/env";
import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint(appwrite_url) // Your API Endpoint
  .setProject(appwrite_id) // Your project ID
  .setKey(appwrite_key); // Your secret API key

const avatars = new Avatars(client);
const database = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

export { avatars, database, storage, users };
