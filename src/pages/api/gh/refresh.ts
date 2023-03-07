import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = {
        refresh_token: getCookie("refresh_token", { req, res }),
        grant_type: "refresh_token",
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET,
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

    const statusCode = accessResp.status;

    const accessData = await accessResp.json();

    if (!accessData.access_token) {
        res.status(statusCode).send("Refresh failed");
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

    res.status(statusCode).send("Refresh successfull");
};

export default handler;
