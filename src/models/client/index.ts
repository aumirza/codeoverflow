import { appwrite_id, appwrite_url } from "@/config/env";
import { Account, Avatars, Client, Databases, Storage } from "appwrite";

const client = new Client().setEndpoint(appwrite_url).setProject(appwrite_id);

const databases = new Databases(client);
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export { client, account, avatars, databases, storage };
