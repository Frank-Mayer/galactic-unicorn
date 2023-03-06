import Head from "next/head";
import Image from "next/image";
import { HeadContent } from "@/components/HeadContent";
import { ProjectList } from "@/components/ProjectList";
import { CookieBanner } from "@/components/CookieBanner";
import { GetStaticProps } from "next";

type Props = {
    githubRedirectOauth: string;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    return {
        props: {
            githubRedirectOauth: process.env.GITHUB_REDIRECT_OAUTH ?? "",
        },
    };
};

export default function Home(context: Props) {
    return (
        <>
            <Head>{...HeadContent}</Head>

            <div className="hero">
                <h1>Galactic Unicorn</h1>
                <p>Create blazingly fast websites without any programming knowledge</p>
                <Image
                    priority
                    className="hero__image"
                    src="/preview.png"
                    alt=""
                    width={512}
                    height={512}
                />
            </div>

            <CookieBanner />

            <ProjectList githubRedirectOauth={context.githubRedirectOauth} />
        </>
    );
}
