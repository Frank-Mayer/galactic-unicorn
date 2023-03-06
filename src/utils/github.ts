import { getCookie } from "cookies-next";
import { Octokit, App } from "octokit";
import { useEffect, useState } from "react";
import { Future } from "@frank-mayer/opsult/Future";

const getAccessToken = () =>
    new Future<string, string>(async (ok, err) => {
        const accessToken = getCookie("access_token");

        if (typeof accessToken == "string") {
            return ok(accessToken);
        }

        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) {
            return err("No access or refresh token");
        }

        const refreshResp = await fetch("/api/gh/refresh");
        if (!refreshResp.ok) {
            return err("Refresh failed");
        }

        if ("location" in globalThis) {
            globalThis.location.reload();
        }

        return err("Reload required");
    });

export const getOctokit = () =>
    getAccessToken().map((accessToken) => new Octokit({ auth: accessToken }));

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

export const newProjectAsync = async () => {
    const octokitRes = await getOctokit();

    if (octokitRes.isOk()) {
        const resp = await octokitRes.unwrap().request("POST /user/repos", {
            name: "unicorn-test-repo",
            description: "This is a test repo",
            homepage: "https://github.com",
            private: true,
            is_template: false,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        console.log(resp);
    }
};
