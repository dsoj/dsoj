import ErrorPage from 'next/error'

export default function UnhandlePage() {
    return (
        <ErrorPage statusCode={404} />
    )
}