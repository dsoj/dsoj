import { MongoClient } from "mongodb";
import Layout from '@/components/Layout';
import ErrorPage from 'next/error';

import EnvVars from "@/constants/EnvVars";
import { DifficultyElement, TagElement } from "@/components/list_element";
import { IProblemListItem } from "@/interface/IProblem";
import { Card, Container, Spinner, Table } from "react-bootstrap";
import Link from "next/link";

export default function TagProblemList({ tag_name, problemList }: { tag_name: string, problemList: IProblemListItem[] }) {
    if (!problemList) {
        return (
            <ErrorPage statusCode={404} />
        )
    }


    function genTableElement(index: number, args: IProblemListItem) {
        const { id, title, accepted, submissions, difficulty, tags } = problemList[index];
        return (
            <tr key={index}>
                <td className='pl-4' style={{ color: "var(--bs-gray-dark)" }}>
                    <span>{id}</span>
                </td>

                <td>
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
                            {title}
                        </span>
                    </Link>
                </td>
                <td>
                    <span className='text-muted'>
                        {Math.round((100 * accepted) / submissions)}%
                    </span>
                </td>
                <td style={{ color: "#e5053a" }}>
                    <DifficultyElement difficulty={difficulty} />
                </td>
                <td>
                    <span>{tags.map((item: string) => TagElement(item))}</span>
                </td>
            </tr>
        )
    }

    function TableContent() {
        let TableElements: React.JSX.Element[] =
            problemList.map((problem, index) => genTableElement(index, problem));

        if (TableElements.length == 0) {
            return (
                <tr>
                    <td colSpan={5}>
                        <Spinner animation='border' variant='primary' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </Spinner>
                    </td>
                </tr>
            );
        }
        return TableElements
    }

    return (
        <Layout>
            <Container style={{ margin: "1em", minWidth: "calc(100vw - 2em)" }}>
                <Card>
                    <Card.Header>
                        <Card.Title
                            className='text-uppercase card-title mb-0'
                            style={{
                                marginTop: "1rem",
                                marginBottom: "1rem!important",
                            }}
                        >
                            Tag: {tag_name}
                        </Card.Title>
                    </Card.Header>

                    <Card.Body>
                        <input
                            type='search'
                            style={{
                                background:
                                    "url(https://icons.getbootstrap.com/assets/icons/search.svg) 8px no-repeat, var(--bs-gray-200)",
                                paddingLeft: "calc(1.4rem + 8px)",
                                borderStyle: "none",
                                borderRadius: "5px",
                                width: "15rem",
                            }}
                            placeholder='Search titles or tags'
                            hidden={EnvVars.CommingSoon}
                        />
                        <Table>
                            <thead>
                                <tr>
                                    <th
                                        className='text-uppercase border-0 font-medium pl-4'
                                        scope='col'
                                        style={{ width: "2rem" }}
                                    >
                                        #
                                    </th>
                                    <th
                                        className='text-uppercase border-0 font-medium'
                                        scope='col'
                                    >
                                        Name
                                    </th>
                                    <th
                                        className='text-uppercase border-0 font-medium'
                                        scope='col'
                                        style={{ width: "7rem" }}
                                    >
                                        Acceptance
                                    </th>
                                    <th
                                        className='text-uppercase border-0 font-medium'
                                        scope='col'
                                        style={{ width: "7rem" }}
                                    >
                                        Difficulty
                                    </th>
                                    <th
                                        className='text-uppercase border-0 font-medium'
                                        scope='col'
                                        style={{ width: "10rem" }}
                                    >
                                        Tags
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableContent />
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </Layout >
    );
}

export async function getServerSideProps(context: any) {
    const mongoURI = EnvVars.DB.URI;
    const mongo = new MongoClient(mongoURI);

    const tag_name = context.query.tagname[0];

    let problemList = await mongo
        .db("Judge")
        .collection("Problems")
        .find({ tags: tag_name }, { projection: { _id: 0 } })
        .toArray()
        .catch((err) => {
            console.error(err);
        })
    return {
        props: {
            tag_name: tag_name,
            problemList: problemList,
        },
    };
}
