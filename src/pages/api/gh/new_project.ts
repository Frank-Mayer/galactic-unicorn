import { getOctokit } from "@/utils/github";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const name = req.query.name;

    if (typeof name != "string") {
        return res.status(400).send("No name provided");
    }

    const octokitRes = await getOctokit({ req, res });

    if (octokitRes.isOk()) {
        octokitRes.unwrap().request("POST /user/repos", {
            name,
            description: "This is a test repo",
            homepage: "https://github.com",
            private: false,
            is_template: false,
        });

        const url = new URL("/edit", process.env.BASE_URL);
        url.searchParams.set("project", name);

        res.redirect(url.toString());
    } else {
        res.status(500).send(octokitRes.unwrapErr());
    }
};

export default handler;
