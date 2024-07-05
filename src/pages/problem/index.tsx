import {Card, Table, Spinner} from "react-bootstrap";
import {IProblemListItem} from "@/interface/IProblem";
import Link from "next/link";

import {MongoClient} from "mongodb";
import EnvVars from "@/constants/EnvVars";
import Layout from "@/components/Layout";

export default function ProblemList({problems}: {problems: IProblemListItem[]}) {
    function genTableElement(index: number, args: IProblemListItem) {
        return (
            <tr>
                <td className='pl-4' style={{color: "var(--bs-gray-dark)"}}>
                    <span>{index}</span>
                </td>

                <td>
                    <Link
                        href={`/problem/${args.id}`}
                        style={{
                            fontSize: "1.25rem",
                            textDecoration: "none",
                            color: "rgb(0,0,0)",
                            fontWeight: "bold",
                        }}
                    >
                        <span style={{fontWeight: "normal !important"}}>
                            {args.title}
                        </span>
                    </Link>
                </td>
                <td>
                    <span className='text-muted'>
                        {args.accessed / args.challenged}
                    </span>
                </td>
                <td style={{color: "#e5053a"}}>
                    <strong>{args.difficulty}</strong>
                </td>
                <td>
                    <span>{args.tags.toString()}</span>
                </td>
            </tr>
        )
    }

    function TableContent() {
        let TableElements = problems.map(
            (item: IProblemListItem, index: number) =>
                genTableElement(index, item)
        );
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

            <input
                type='search'
                style={{
                    background:
                        "url(&quot;https://icons.getbootstrap.com/assets/icons/search.svg&quot;) 8px no-repeat, var(--bs-gray-200)",
                    paddingLeft: "calc(1.4rem + 8px)",
                    borderStyle: "none",
                    borderRadius: "5px",
                    width: "15rem",
                }}
                placeholder='Search titles or tags'
            />

            <Card.Body>
                <Table>
                    <thead>
                        <tr>
                            <th
                                className='text-uppercase border-0 font-medium pl-4'
                                scope='col'
                                style={{width: "2rem"}}
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
                                style={{width: "7rem"}}
                            >
                                Acceptance
                            </th>
                            <th
                                className='text-uppercase border-0 font-medium'
                                scope='col'
                                style={{width: "7rem"}}
                            >
                                Difficulty
                            </th>
                            <th
                                className='text-uppercase border-0 font-medium'
                                scope='col'
                                style={{width: "10rem"}}
                            >
                                Tags
                            </th>
                        </tr>
                    </thead>
                    <TableContent />
                </Table>
            </Card.Body>
        </Card>
        </Layout>
    );
}

export async function getServerSideProps() {
    const mongoURI = EnvVars.DB.URI;
    const mongo = new MongoClient(mongoURI);

    let problemData = (await mongo
        .db("Judge")
        .collection("Problems")
        .find({}, {projection: {_id: 0, details: 0}})
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
