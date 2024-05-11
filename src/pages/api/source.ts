// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const options = { method: "GET", headers: { "x-api-key": process.env.CAMB_API_KEY } };

  const resp = await fetch("https://client.camb.ai/apis/source_languages", options as any)
  const json = await resp.json();
  res.status(200).json(json);
}
