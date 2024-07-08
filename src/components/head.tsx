import Head from "next/head";

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
        </Head>
    )
}