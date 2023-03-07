import { getRandomProjectName } from "@/utils/getRandomProjectName";
import { useOctokit } from "@/utils/github";
import { panic } from "@frank-mayer/panic";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    githubRedirectOauth: string;
};

export const ProjectList = (props: Props) => {
    const loginUrl = new URL("https://github.com/login/oauth/authorize");
    loginUrl.searchParams.set("client_id", "Iv1.76c5becd7bf2fb22");
    loginUrl.searchParams.set(
        "redirect_uri",
        props.githubRedirectOauth || panic("No redirect URL")
    );
    loginUrl.searchParams.set("state", "unicorn_" + new Date().toDateString());
    loginUrl.searchParams.set("allow_signup", "true");
    const [projects, setProjects] = useState(new Array<string>());
    const octokit = useOctokit();

    useEffect(() => {
        if (!octokit) {
            return;
        }

        octokit
            .request("GET /user/repos", {
                sort: "updated",
            })
            .then((response) => {
                setProjects(response.data.map((repo) => repo.name));
            });
    }, [octokit]);

    return octokit ? (
        <div className="project-list">
            <h2>Your Projects</h2>

            <h3>New Project</h3>
            <NewProjectForm />

            <br />

            <h3>Settings</h3>
            <Link
                className="project-list__button"
                href="https://github.com/apps/galactic-unicorn-gh"
                target="_blank"
            >
                Configure GitHub App
            </Link>

            <br />

            <h3>Existing Projects</h3>
            <ul>
                {projects.map((project) => {
                    const url = new URL("/edit", window.location.href);
                    url.searchParams.set("project", project);
                    return (
                        <li key={project}>
                            <Link href={url.href}>{project}</Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    ) : (
        <div className="project-list">
            <h2>Your Projects</h2>
            <p>You must be signed in to see your projects</p>
            <a className="project-list__button" href={loginUrl.href}>
                Sign in
            </a>
        </div>
    );
};

const NewProjectForm = () => {
    const [projectName, setProjectName] = useState(getRandomProjectName());

    return (
        <form
            className="project-list__form"
            action="/api/gh/new_project"
            method="get"
        >
            <label>
                New project name (use lowercase letters and dashes only)
                <input
                    type="text"
                    name="name"
                    value={projectName}
                    required
                    pattern="^[a-z-_]+$"
                    onChange={(ev) => setProjectName(ev.target.value)}
                />
            </label>
            <input className="project-list__button" type="submit" value="Create" />
        </form>
    );
};
