import { getCookie } from "cookies-next";
import { Octokit } from "octokit";
import { useEffect, useState } from "react";
import { Future } from "@frank-mayer/opsult/Future";
import { NextApiRequest, NextApiResponse } from "next/types";

type ApiReference = {
    req: NextApiRequest;
    res: NextApiResponse;
};

const getAccessToken = (apiReference?: ApiReference) =>
    new Future<string, string>(async (ok, err) => {
        const accessToken = getCookie("access_token", apiReference);

        if (typeof accessToken == "string") {
            return ok(accessToken);
        }

        const refreshToken = getCookie("refresh_token", apiReference);
        if (!refreshToken) {
            return err(
                "Could not authenticate to Octokit: No access or refresh token"
            );
        }

        const refreshResp = await fetch("/api/gh/refresh");
        if (!refreshResp.ok) {
            return err("Could not authenticate to Octokit: Refresh failed");
        }

        if ("location" in globalThis) {
            globalThis.location.reload();
        }

        return err("Reload required to access Octokit");
    });

export const getOctokit = (apiReference?: ApiReference) =>
    getAccessToken(apiReference).map(
        (accessToken) => new Octokit({ auth: accessToken })
    );

export const useOctokit = (): Octokit | undefined => {
    const [octokit, setOctokit] = useState<Octokit | undefined>(undefined);

    useEffect(() => {
        if (octokit) return;

        getOctokit().then((res) => {
            if (res.isOk()) {
                setOctokit(res.unwrap());
            }
        });
    });

    return octokit;
};
