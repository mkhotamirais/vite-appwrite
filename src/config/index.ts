import { Client, Account, ID, Databases, Storage } from "appwrite";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const apiEndpoint = import.meta.env.VITE_APPWRITE_API_ENDPOINT;
const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collBookId = import.meta.env.VITE_APPWRITE_COLLECTION_BOOK_ID;

const collProductId = import.meta.env.VITE_APPWRITE_COLLECTION_PRODUCT_ID;
const collProductBucketId = import.meta.env.VITE_APPWRITE_PRODUCT_BUCKET_ID;

const uniqueId = () => ID.unique();

const client = new Client().setEndpoint(apiEndpoint).setProject(projectId);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export {
  projectId,
  apiEndpoint,
  dbId,
  collBookId,
  collProductId,
  collProductBucketId,
  uniqueId,
  client,
  account,
  databases,
  storage,
};
