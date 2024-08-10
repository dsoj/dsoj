import { Card, Table, Spinner, Button, Container } from "react-bootstrap";
import { IProblemListItem } from "@/interface/IProblem";
import Link from "next/link";

import { MongoClient } from "mongodb";
import EnvVars from "@/constants/EnvVars";
import Layout from "@/components/Layout";
// import { getSession } from "@/lib/session";
import { difficulty_text, DifficultyElement } from "@/lib/problem";

export default function ProblemList({ problems }: { problems: IProblemListItem[] }) {
    function genTagElement(tag: string) {
        return (
            <Button className="btn btn-primary" type="button" href={`/tag/${tag}`} key={tag} style={{ height: "1.5rem", padding: 0, fontSize: "0.8rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", marginRight: "0.3rem", background: "rgb(190,190,190)", borderStyle: "none", borderTopStyle: "none" }}>
                #{tag}
            </Button>
        )
    }


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
                    <span>{tags.map((item)=>genTagElement(item))}</span>
                </td>
            </tr>
        )
    }

    function TableContent() {
        let TableElements: React.JSX.Element[] = [];
        for (let i = 0; i < problems.length; i++) {
            TableElements.push(genTableElement(i, problems[i]));
        }

        return (
            <tbody>
                {TableElements.length != 0 ? (
                    TableElements
                ) : (
                    <Spinner animation='border' variant='primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </Spinner>
                )}
            </tbody>
        );
    }

    return (
        <Layout>
            <Container style={{margin: "1em", minWidth: "calc(100vw - 2em)"}}>
                <Card>
                    <Card.Header>
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
    // const session = await getSession(req, res);
    // console.log(session)

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
}
