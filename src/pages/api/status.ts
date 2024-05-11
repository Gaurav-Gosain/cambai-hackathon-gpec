// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { task_id } = JSON.parse(req.body);

  const options = {
    method: "GET",
    headers: {
      "x-api-key": process.env.CAMB_API_KEY,
      "Content-Type": "application/json",
    },
  };

  const resp = await fetch(
    "https://client.camb.ai/apis/end_to_end_dubbing/"+task_id,
    options as any
  );
  const json = await resp.json();
  res.status(200).json(json);
}
