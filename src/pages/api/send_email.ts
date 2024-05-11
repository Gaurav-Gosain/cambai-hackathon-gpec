// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email,data } = JSON.parse(req.body);

  const options = {
    method: "POST",
    headers: {
      "x-api-key": process.env.CAMB_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      data: data,
    }),
  };

  const resp = await fetch("https://camb.gauravgosain.dev/email", options as any);
  const json = await resp.json();
  console.log(json);
  res.status(200).json(json);
}
