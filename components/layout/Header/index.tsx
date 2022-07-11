import Head from "next/head";

interface HeaderPropsType {
    title?: string,
    description?: string,
}
export default function Header({ title, description }: HeaderPropsType) {
    return (
        <Head>
            <title>{title ?? 'Fangio buses'}</title>
            <meta name="description" content={description ?? 'Dapp for Fangio buses'} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}
