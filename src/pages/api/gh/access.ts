import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = req.body;

    if (!body) {
        res.status(400).send("Bad request");
        return;
    }

    res.status(200).send("OK");
};

export default handler;
