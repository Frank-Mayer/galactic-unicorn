import "@/styles/global.scss";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}
