import { getCookies, getCookie } from "cookies-next";
import { Octokit, App } from "octokit";
import { useEffect, useState } from "react";

let octokit: Octokit | undefined;

export const getOctokitAsync = async (): Promise<Octokit> => {
    if (!octokit) {
        const accessToken = getCookie("access_token");

        if (!accessToken) {
            const refreshToken = getCookie("refresh_token");
            if (!refreshToken) {
                throw new Error("No access or refresh token");
            }

            // refresh the token
            const refreshResp = await fetch("/api/gh/refresh");
            if (!refreshResp.ok) {
                throw new Error("Refresh failed");
            }

            location.reload();

            throw new Error("Reload required");
        } else {
            octokit = new Octokit({ auth: accessToken });
        }
    }

    return octokit;
};

export const useOctokit = (): Octokit | undefined => {
    const [octokit, setOctokit] = useState<Octokit | undefined>(undefined);

    useEffect(() => {
        getOctokitAsync()
            .then((octokit) => setOctokit(octokit))
            .catch(() => { });
    });

    return octokit;
};

export const newProjectAsync = async () => {
    const octokit = await getOctokitAsync();
    await octokit.request("POST /user/repos", {
        name: "unicorn-test-repo",
        description: "This is a test repo",
        homepage: "https://github.com",
        private: true,
        is_template: false,
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });
};
