import { Card, Table, Spinner, Button, Container } from "react-bootstrap";
import { IProblemListItem } from "@/interface/IProblem";
import Link from "next/link";

import { MongoClient } from "mongodb";
import EnvVars from "@/constants/EnvVars";
import Layout from "@/components/Layout";
import { DifficultyElement } from "@/components/list_element";
import { TagElement } from "@/components/list_element";


export default function ProblemList({ problems }: { problems: IProblemListItem[] }) {
    function genTableElement(index: number, args: IProblemListItem) {
        const { id, title, accepted, submissions, difficulty, tags } = problems[index];
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
                    <span>{tags.map((item) => TagElement(item))}</span>
                </td>
            </tr>
        )
    }

    function TableContent() {
        let TableElements: React.JSX.Element[] =
            problems.map((problem, index) => genTableElement(index, problem));

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
        return (
            <tbody>
                {TableElements}
            </tbody>
        );
    }

    return (
        <Layout>
            <Container style={{ margin: "1em", minWidth: "calc(100vw - 2em)" }}>
                <Card style={{ border: "none" }}>
                    <Card.Header style={{ backgroundColor: "white", border: "none" }}>
                        <Card.Title
                            className='text-uppercase card-title mb-0'
                            style={{
                                marginTop: "1rem",
                                marginBottom: "1rem!important",
                            }}
                        >
                            problems
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
                            hidden={true} // TODO: Comming soon
                        />
                        <Table className="table-striped">
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
                            <TableContent />
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </Layout>
    );
}

export async function getServerSideProps({ req, res }: any) {
    const mongoURI = EnvVars.DB.URI;
    const mongo = new MongoClient(mongoURI);

    try {
        let problemData = (await mongo
            .db("Judge")
            .collection("Problems")
            .find({}, { projection: { _id: 0, details: 0 } })
            .toArray()
            .catch((err) => {
                console.error(err);
                return [];
            })) as IProblemListItem[];
        return {
            props: {
                problems: problemData,
            },
        };
    } catch (err) {
        console.error(err);
        return {
            props: {
                problems: [],
            },
        };
    }
}
