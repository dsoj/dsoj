import Layout from "@/components/Layout";
import EnvVars from "@/constants/EnvVars";
import { IProblemListItem } from "@/interface/IProblem";
import { DifficultyElement, SubmissionStatusElement } from "@/lib/problem_elements";
import { getCookie } from "cookies-next";
import { MongoClient } from "mongodb";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Carousel } from "react-bootstrap";

export default function Home({ favourites, recent, my_submissions, top_hits }: any) { // TODO: change any to the correct type
    const [username, setUsername] = useState<string | null>(null);
    const banner_images = ['1', '2', '3', '4']; // TODO: get path from db

    function genTagElement(tag: string) {
        return (
            <Button className="btn btn-primary" type="button" href={`/tag/${tag}`} key={tag} style={{ height: "1.5rem", padding: 0, fontSize: "0.8rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", marginRight: "0.3rem", background: "rgb(190,190,190)", borderStyle: "none", borderTopStyle: "none" }}>
                #{tag}
            </Button>
        )
    }

    useEffect(() => {
        const cookieUsername = getCookie('username');
        if (cookieUsername) {
            setUsername(cookieUsername);
        } else {
            setUsername('no tLogin');
            //TODO: not login
        }
    })

    function problemCardElement(id: number, title: string, status: number) {
        return (
            <tr key={id}>
                <td>{id}. {title}</td>
                <td align="right">
                    <SubmissionStatusElement status={status} />
                </td>
            </tr>
        )
    }

    return (
        <Layout>
            {/* Banner Image Strart */}
            <Carousel style={{ marginBottom: '2rem' }}>
                {banner_images.map((image: string, index: number) => {
                    return (
                        <Carousel.Item>
                            <Image key={index} className="w-100 d-block" src={`/banner_images/${image}.png`} alt="Slide Image" width={100} height={300} />
                        </Carousel.Item>
                    )
                })}
            </Carousel>
            {/* Banner Image End */}

            {/* Welcome Text Start */}
            <div style={{ marginTop: "1rem", marginLeft: "10rem" }}>
                <span style={{ color: "var(--bs-gray-600)" }}>
                    Welcome back,&nbsp;<span style={{ fontWeight: "bold" }}>{username ?? ''}</span>, to
                </span>
                <p style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
                    DSOJ
                </p>
            </div>
            {/* Welcome Text End */}

            {/* Card Start */}
            <div
                className="card-group"
                style={{ marginLeft: "2rem", marginRight: "2rem", marginBottom: "2rem" }}
            >
                {/* Favourites Section Start */}
                <div
                    className="card"
                    style={{
                        borderRadius: 10,
                        marginRight: "1rem",
                        boxShadow: "0px 0px 3px 0px"
                    }}
                >

                    <div
                        className="card-body"
                        style={{ borderRightWidth: 1, borderRightColor: "var(--bs-gray-600)" }}
                    >
                        {/* TODO: change icon into bi or component */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-star-half" style={{ fontSize: '3rem' }}>
                            <path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"></path>
                        </svg>

                        <span style={{ marginLeft: "1rem", fontSize: "1.5rem" }}>
                            <strong>Favourites</strong>
                        </span>
                        <div>
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        {/* {favourites.map((item: any) => problemCardElement(item.id, item.title, item.status))} */}
                                        {/* TODO: temp fix status */}
                                        {favourites.map((item: any) => problemCardElement(item.id, item.title, 0))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Favourites Section End */}

                {/* Recent Section Start */}
                <div
                    className="card"
                    style={{
                        marginRight: "1rem",
                        boxShadow: "0px 0px 3px",
                        borderRadius: 10
                    }}
                >
                    <div className="card-body">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="bi bi-clock-history"
                            style={{ fontSize: "3rem" }}
                        >
                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483m.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535m-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                        </svg>
                        <span style={{ marginLeft: "1rem", fontSize: "1.5rem" }}>
                            <strong>Recent Views</strong>
                        </span>
                        <div className="table-responsive">
                            <table className="table">
                                <tbody>
                                    {recent.map((item: any) => problemCardElement(item.id, item.title, item.status))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Recent Section End */}

                {/* MySubmissions Section Start */}
                <div
                    className="card"
                    style={{ boxShadow: "0px 0px 3px", borderRadius: 10 }}
                >
                    <div className="card-body">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="bi bi-code-slash"
                            style={{ fontSize: "3rem" }}
                        >
                            <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                        </svg>
                        <span style={{ marginLeft: "1rem", fontSize: "1.5rem" }}>
                            <strong>My Submissions</strong>
                        </span>
                        <div className="table-responsive">
                            <table className="table">
                                <tbody>
                                    {my_submissions.map((item: any) => problemCardElement(item.id, item.title, item.status))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* MySubmissions Section End */}
            </div>
            {/* Card End */}


            {/* Top Hits Start */}
            <div style={{ paddingRight: "10rem", paddingLeft: "10rem" }}>
                <div className="card">
                    <div className="card-body">
                        <span style={{ fontSize: "3rem" }}>
                            <strong>Top Hits</strong>
                        </span>
                        <div className="table-responsive">
                            <table className="table table-striped no-wrap user-table mb-0">
                                <thead>
                                    <tr>


                                        <th
                                            className="text-uppercase border-0 font-medium pl-4"
                                            scope="col"
                                            style={{ width: "5rem" }}
                                        >
                                            No.
                                        </th>
                                        <th className="text-uppercase border-0 font-medium" scope="col">
                                            Name
                                        </th>
                                        <th
                                            className="text-uppercase border-0 font-medium"
                                            scope="col"
                                            style={{ width: "7rem" }}
                                        >
                                            Acceptance
                                        </th>
                                        <th
                                            className="text-uppercase border-0 font-medium"
                                            scope="col"
                                            style={{ width: "7rem" }}
                                        >
                                            Difficulty
                                        </th>
                                        <th
                                            className="text-uppercase border-0 font-medium"
                                            scope="col"
                                            style={{ width: "10rem" }}
                                        >
                                            Tags
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top_hits.map((item: any, index: number) => {
                                        const { id, title, accepted, submissions, difficulty, tags } = item;
                                        return (
                                            <tr>
                                                <td className="pl-4" style={{ color: "var(--bs-gray-600)" }}>
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <a
                                                        href="#"
                                                        style={{
                                                            fontSize: "1.25rem",
                                                            textDecoration: "none",
                                                            color: "rgb(0,0,0)",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        <span className='text-muted'>
                                                            <Link
                                                                href={`/problem/${id}`}
                                                                style={{
                                                                    fontSize: "1.25rem",
                                                                    textDecoration: "none",
                                                                    color: "rgb(0,0,0)",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                <span style={{ fontWeight: "normal !important" }}>
                                                                    {id}. {title}
                                                                </span>
                                                            </Link>
                                                        </span>
                                                    </a>
                                                </td>
                                                <td>
                                                    <span className="text-muted">
                                                        {Math.round((100 * accepted) / submissions)}%
                                                    </span>
                                                </td>
                                                <td style={{ color: "#e5053a" }}>
                                                    <DifficultyElement difficulty={difficulty} />
                                                </td>
                                                <td>
                                                    <span>{tags.map((item: any) => genTagElement(item))}</span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Top Hits End */}

            {/* Coder Start */}
            <section className="py-4 py-xl-5">
                <div className="container h-100">
                    <div className="row h-100">
                        <div className="col-md-10 col-xl-8 text-center d-flex d-sm-flex d-md-flex justify-content-center align-items-center mx-auto justify-content-md-start align-items-md-center justify-content-xl-center">
                            <div>
                                <h2 className="text-uppercase fw-bold mb-3" style={{ fontFamily: "Copperplate", fontSize: "2.5rem" }}>
                                    "Coders together strong."
                                </h2>
                                <button
                                    className="btn btn-primary fs-5 me-2 py-2 px-4"
                                    type="button"
                                >
                                    About us
                                </button>
                                <button
                                    className="btn btn-outline-primary fs-5 py-2 px-4"
                                    type="button"
                                >
                                    Github
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Coder End */}
        </Layout>
    );
}


export async function getServerSideProps() {
    const mongoURI = EnvVars.DB.URI;
    const mongo = new MongoClient(mongoURI);

    // TODO: set filter 
    let favourites = (await mongo
        .db("Judge")
        .collection("Problems")
        .find({}, { projection: { _id: 0, details: 0 } })
        .toArray()
        .catch((err) => {
            console.error(err);
            return [];
        })) as IProblemListItem[];

    console.log(favourites);
    return {
        props: {
            favourites: favourites,
            recent: favourites,
            my_submissions: favourites,
            top_hits: favourites,
        },
    };
}
