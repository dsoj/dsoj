"use client";
import ErrorPage from 'next/error';
import { IProblemListItem } from '@/interface/IProblem';
import { Card, Table, Spinner, Container } from "react-bootstrap";
import { DifficultyElement, TagElement } from "@/component/ListElement";
import { useEffect, useState } from 'react';

import Link from 'next/link';

export default function ProblemList({ tag }: { tag: string; }) {
    const [problems, setProblems] = useState<IProblemListItem[]>([]);
    const [isNotFound, setIsNotFound] = useState<boolean | null>(null);

    // HOOK START
    // Fetch problem list
    useEffect(() => {
        fetch(`/api/problem/tag/${tag}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.problemList) {
                    setIsNotFound(true);
                    return;
                }
                setProblems(data.problemList);
                setIsNotFound(false);
            });
    }, [tag]);
    // HOOK END


    // HANDLER START
    if (isNotFound === true) {
        return (
            <ErrorPage statusCode={404} />
        );
    }

    if (isNotFound === null || problems === null) {
        return (
            <div>Loading...</div>
        );
    }
    // HANDLER END

    // COMPONENT START
    function genTableElement(index: number) {
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
        );
    }

    function TableContent() {
        let TableElements: React.JSX.Element[] =
            problems.map((problem, index) => genTableElement(index));

        if (TableElements.length == 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={5}>
                            <Spinner animation='border' variant='primary' role='status'>
                                <span className='visually-hidden'>Loading...</span>
                            </Spinner>
                        </td>
                    </tr>
                </tbody>
            );
        }
        return (
            <tbody>
                {TableElements}
            </tbody>
        );
    }
    // COMPONENT END

    return (
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
                        TAGS: <strong>{tag}</strong>
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
    );
}