import Head from "next/head";
import Script from "next/script";

export const metadata = {
    title: 'DSOJ',
    description: 'DongShan High School Online Judge',
    logo_path: '/logo_s.png',
}


export default function HeadComponent() {
    const { title, description, logo_path } = metadata;
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta charSet="utf-8" />
            <link rel="apple-touch-icon" type="image/png" sizes="180x180" href={logo_path} />
            <link rel="icon" type="image/png" sizes="180x180" href={logo_path} />
            <link rel="stylesheet" href="/index.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@2.3/code-input.min.css" />
            <Script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@2.3/code-input.min.js"></Script>
        </Head>
    )
}