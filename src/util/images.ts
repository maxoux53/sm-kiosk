import Cloudflare from "cloudflare";
import { DirectUploadCreateResponse } from "cloudflare/resources/images/v2.mjs";
import "dotenv/config";

const client = new Cloudflare({
    apiToken: process.env.CF_API_TOKEN!
});
const account_id = process.env.CF_ACCOUNT_ID!;

export async function genImgUploadUrl(): Promise<DirectUploadCreateResponse> {
    return await client.images.v2.directUploads.create({ account_id });
}

export async function eraseStoredImage(imageId: string): Promise<void> {
    console.log(await client.images.v1.delete(imageId, { account_id })); // pas clair ce que ça retourne
}
