// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, source, target } = JSON.parse(req.body);

  console.log({
    video_url: "https://camb.gauravgosain.dev/assets/" + email + ".webm.mp4",
    source_language: source,
    target_language: target,
  });

  const options = {
    method: "POST",
    headers: {
      "x-api-key": process.env.CAMB_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video_url: "https://camb.gauravgosain.dev/assets/" + email + ".webm.mp4",
      source_language: source,
      target_language: target,
    }),
    //   '{"video_url":"https://camb.gauravgosain.dev/assets/' +
    //   email +
    //   '.webm.mp4","source_language":' +
    //   source +
    //   ',"target_language":' +
    //   target +
    //   "}",
  };

  const resp = await fetch(
    "https://client.camb.ai/apis/end_to_end_dubbing",
    options as any
  );
  const json = await resp.json();
  console.log(json);
  res.status(200).json(json);
}
