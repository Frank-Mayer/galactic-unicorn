import Head from "next/head";
import Image from "next/image";
import { HeadContent } from "@/components/HeadContent";
import { ProjectList } from "@/components/ProjectList";

export default function Home() {
    return (
        <>
            <Head>{...HeadContent}</Head>

            <div className="hero">
                <h1>Galactic Unicorn</h1>
                <p>Create blazingly fast websites without any programming knowledge</p>
                <Image
                    className="hero__image"
                    src="/preview.png"
                    alt=""
                    width={512}
                    height={512}
                />
            </div>

            <div>
                <ProjectList />
            </div>
        </>
    );
}
