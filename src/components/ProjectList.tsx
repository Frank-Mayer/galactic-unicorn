import { useSession, signIn, signOut } from "next-auth/react";

export const ProjectList = () => {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div>
                <h2>Your Projects</h2>
                <p>You must be signed in to see your projects</p>
                <button onClick={() => signIn()}>Sign In</button>
            </div>
        );
    }

    if (!session.user || !session.user.email) {
        return (
            <div>
                <h2>Something went wrong</h2>
                <p>
                    We were not able to retrieve your account information, this is nessary
                    to access your projects
                </p>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Projects of {session.user.email}</h2>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );
};
