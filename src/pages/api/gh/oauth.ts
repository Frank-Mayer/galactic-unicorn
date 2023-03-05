import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { code, state } = req.query;

    if (
        !code ||
        typeof code != "string" ||
        !state ||
        typeof state != "string" ||
        !state.startsWith("unicorn")
    ) {
        res.status(400).send("Bad request");
        return;
    }

    // POST https://github.com/login/oauth/access_token

    const data = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_ACCESS,
    };

    const accessResp = await fetch(
        "https://github.com/login/oauth/access_token",
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const accessData = await accessResp.json();

    if (!accessData.access_token) {
        res.status(400).send("Bad request");
        return;
    }

    const tokenSecondsLifetime =
        "expires_in" in accessData ? accessData.expires_in : 60 * 60 * 8;

    const refreshTokenExpire =
        "refresh_token_expires_in" in accessData
            ? accessData.refresh_token_expires_in
            : 60 * 60 * 24 * 30 * 6;

    setCookie("access_token", accessData.access_token, {
        req,
        res,
        maxAge: tokenSecondsLifetime,
    });

    setCookie("refresh_token", accessData.refresh_token, {
        req,
        res,
        maxAge: refreshTokenExpire,
    });

    res.redirect("/");
};

export default handler;
