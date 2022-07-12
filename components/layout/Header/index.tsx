import Head from "next/head";

interface HeaderPropsType {
    title?: string,
    description?: string,
}
export default function Header({ title, description }: HeaderPropsType) {
    return (
        <Head>
            <title>{title ?? 'Transfers Dapp'}</title>
            <meta name="description" content={description ?? 'Transfers Dapp'} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}
