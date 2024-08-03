import { questionAttachmentsBucket } from "@/config/db";
import { storage } from "./config";
import { Permission } from "node-appwrite";

export default async function getOrCreateStorageBucket() {
  try {
    await storage.getBucket(questionAttachmentsBucket);
    console.log("StorageBucket connected.");
  } catch (error) {
    try {
      await storage.createBucket(
        questionAttachmentsBucket,
        questionAttachmentsBucket,
        [
          Permission.read("any"),
          Permission.read("users"),
          Permission.create("users"),
          Permission.delete("users"),
          Permission.update("users"),
        ],
        false,
        undefined,
        undefined,
        ["png", "jpeg", "webp", "heic", "jpg"]
      );
      console.log("StorageBucket created.");
      console.log("StorageBucket connected.");
    } catch (error) {
      console.log("Some error Ocurred while creating Bucket", error);
    }
  }
}
