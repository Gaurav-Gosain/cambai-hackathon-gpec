import PocketBase from "pocketbase";

// const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL_LOCAL);

if (process.env.NODE_ENV === "development") pb.autoCancellation(false);

export default pb;
