import { useOctokit } from "@/utils/github";
import { useEffect, useState } from "react";

const loginUrl = new URL("https://github.com/login/oauth/authorize");
loginUrl.searchParams.set("client_id", "Iv1.76c5becd7bf2fb22");
loginUrl.searchParams.set(
    "redirect_uri",
    process.env.GITHUB_REDIRECT_OAUTH ?? "http://localhost:3000/api/gh/oauth"
);
loginUrl.searchParams.set(
    "state",
    "unicorn_" + new Date().toLocaleDateString()
);
loginUrl.searchParams.set("allow_signup", "true");

export const ProjectList = () => {
    const [projects, setProjects] = useState(new Array<string>());
    const octokit = useOctokit();

    useEffect(() => {
        if (!octokit) {
            return;
        }
        octokit.request("GET /user/repos").then((response) => {
            setProjects(response.data.map((repo) => repo.name));
        });
    }, [octokit]);

    if (octokit) {
        return (
            <div>
                <h2>Your Projects</h2>
                <ul>
                    {projects.map((project) => (
                        <li key={project}>{project}</li>
                    ))}
                </ul>
            </div>
        );
    } else
        return (
            <div>
                <h2>Your Projects</h2>
                <p>You must be signed in to see your projects</p>
                <a href={loginUrl.href}>Sign in</a>
            </div>
        );
};
