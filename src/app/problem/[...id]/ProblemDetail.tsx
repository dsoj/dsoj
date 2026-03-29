"use client";
import ErrorPage from 'next/error';
import { DifficultyElement, TagElement } from "@/component/ListElement";
import { IProblem } from "@/interface/IProblem";
import AlertMessage from "@/component/Alert";
import { useEffect, useState } from "react";
import CodeEditor from '@monaco-editor/react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Link from 'next/link';
import { Language } from '@/constant/Judge';
import { useSession } from '@/context/sessionState';
import { Button, Row, Col, Container, Card, Modal, Accordion, Badge } from 'react-bootstrap';

export default function ProblemDetail({ problem_id }: { problem_id: string; }) {
    const [problemDetail, setProblemDetail] = useState<IProblem | null>(null);
    const [submissionResult, setSubmissionResult] = useState<any[]>([]);
    const [isNotFound, setIsNotFound] = useState<boolean | null>(null);

    // alert popup
    const [alertStatus, setAlertStatus] = useState<boolean>(false);
    const [alert_text, setAlertText] = useState<string>('');
    const [alert_variant, setAlertVariant] = useState<string>('success');

    // modal state: index of the open modal, or -1 if none
    const [openModalIndex, setOpenModalIndex] = useState<number>(-1);

    const { isLoggedIn, username } = useSession();

    // Fetch Detail data
    useEffect(() => {
        fetch(`/api/problem/${problem_id}`)
            .then((res) => res.json())
            .then((res) => {
                const data = res.data;
                if (!data.problemDetail) {
                    setIsNotFound(true);
                    return;
                }
                setProblemDetail(data.problemDetail);
                setIsNotFound(false);
            });
    }, [problem_id]);

    // Fetch Submission result
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetch(`/api/submission?problem_id=${problem_id}&username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSubmissionResult(data.data);
                }
            });
    }, [problem_id, isLoggedIn, username]);



    if (isNotFound === true) {
        return (
            <ErrorPage statusCode={404} />
        );
    }

    if (isNotFound === null || problemDetail === null) {
        return (
            <div>Loading...</div>
        );
    }

    const { id, title, difficulty, tags, details, accepted, submissions, samples } = problemDetail;

    function doCopy(text: string) {
        navigator.clipboard.writeText(text)
            .then(() => {
                setAlertText('Copied!');
                setAlertVariant('success');
                setAlertStatus(true);
                setTimeout(() => {
                    setAlertStatus(false);
                }, 1000);
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
                setAlertText('Error coping text.');
                setAlertVariant('alert');
                setAlertStatus(true);
                setTimeout(() => {
                    setAlertStatus(false);
                }, 1000);
            });
    }

    return (
        <>
            <div style={{ padding: '2rem', background: "#ededed" }}>
                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                    <h2>{id}. {title}&nbsp;
                        <Link href={`/submit/${problem_id}/`}>
                            <Button
                                variant="primary"
                                type="button"
                                style={{ background: "var(--bs-form-valid-color)", borderStyle: "none" }}
                            >
                                Submit
                            </Button>
                        </Link></h2>

                    <div style={{ marginBottom: "1rem" }}>
                        <DifficultyElement difficulty={difficulty} />
                        {tags.map((item) => TagElement(item))}
                    </div>
                    <p style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}> {details} </p>

                    {/* Descriptions */}
                    <div style={{ borderTop: "1px solid var(--bs-body-color)", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                        <span style={{ marginRight: "3rem" }}>
                            Accepted&nbsp;&nbsp;
                            <span style={{ fontSize: 24 }}>
                                <strong>{accepted}</strong>
                            </span>
                            &nbsp;
                        </span>
                        <span style={{ marginRight: "3rem" }}>
                            Submissions&nbsp;&nbsp;
                            <span style={{ fontSize: 24 }}>
                                <strong>{submissions}</strong>
                            </span>
                            &nbsp;
                        </span>
                        <span>
                            Acceptance Rate&nbsp;&nbsp;
                            <span style={{ fontSize: 24 }}>
                                <strong>{Math.round((100 * accepted) / submissions)}%</strong>
                            </span>
                            &nbsp;
                        </span>
                    </div>
                </div>

                {/* Examples */}
                {samples.map((sample, index) => {
                    return (
                        <Row style={{ margin: '0px' }} key={index}>
                            <Col md={6} onClick={() => doCopy(sample.input)} style={{ paddingRight: '0.5rem', paddingLeft: '0px' }}>
                                <div className="sample" style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                                    <h4>Sample Input {index}</h4>
                                    <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.input}</span>
                                </div>
                            </Col>

                            <Col md={6} onClick={() => doCopy(sample.output)} style={{ paddingLeft: '0.5rem', paddingRight: '0px' }}>
                                <div className="sample" style={{ borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem', background: '#ffffff' }}>
                                    <h4>Sample Output {index}</h4>
                                    <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.output}</span>
                                </div>
                            </Col>
                        </Row>
                    );
                })}


                {(submissionResult.length > 0) &&
                    <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                        <h4>Submissions</h4>
                        <Tabs defaultActiveKey="0" className="mb-3">
                            {submissionResult.map((item: any, index: number) => {
                                const title = `${item.status} ${new Date(item.send_time).toLocaleDateString()}-${Language[item.language_id][0]}`;
                                return (
                                    <Tab eventKey={index} title={title} key={index}>
                                        <Container style={{ textAlign: 'center' }}>
                                            <Row className="mb-1">
                                                <Col md={6}>
                                                    <span>Time: &nbsp; {new Date(item.send_time).toLocaleString()}</span>
                                                </Col>
                                                <Col md={6}>
                                                    <span>Language: &nbsp; {Language[item.language_id][0]}</span>
                                                </Col>
                                            </Row>

                                            <Row className="mb-1">
                                                <Col md={6}>
                                                    <span>Status: &nbsp;
                                                        {(item.status === "Accepted") ?
                                                            <Badge bg="success">{item.status}</Badge> :
                                                            <Badge bg="danger">{item.status}</Badge>
                                                        }
                                                    </span>
                                                </Col>

                                                {/* Modal Trigger */}
                                                <Col md={6}>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() => setOpenModalIndex(index)}
                                                    >
                                                        SubTasks
                                                    </Button>
                                                </Col>
                                            </Row>

                                            {/* Modal */}
                                            <Modal
                                                show={openModalIndex === index}
                                                onHide={() => setOpenModalIndex(-1)}
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title className="fs-5">
                                                        {title}
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    {/* Modal Body */}
                                                    <Container>
                                                        <div className="pb-1 pt-0">Submission ID: {item.submission_id}</div>
                                                        <Accordion className="py-2">
                                                            {item.submissions.map((subTask: any, subIndex: number) => {
                                                                return (
                                                                    <Accordion.Item eventKey={String(subIndex)} key={subIndex}>
                                                                        <Accordion.Header>
                                                                            #{subIndex} {subTask.status}
                                                                        </Accordion.Header>
                                                                        <Accordion.Body>
                                                                            {/* Compile Output */}
                                                                            {subTask.compile_output &&
                                                                                <Card className="mb-3">
                                                                                    <Card.Header>Compile Output</Card.Header>
                                                                                    <Card.Body className="bg-light">
                                                                                        <pre className="mb-0">
                                                                                            <code>
                                                                                                {subTask.compile_output}
                                                                                            </code>
                                                                                        </pre>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            }

                                                                            {/* stdout */}
                                                                            {subTask.stdout &&
                                                                                <Card className="mb-3">
                                                                                    <Card.Header>stdout</Card.Header>
                                                                                    <Card.Body className="bg-light">
                                                                                        <pre className="mb-0">
                                                                                            <code>
                                                                                                {subTask.stdout}
                                                                                            </code>
                                                                                        </pre>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            }

                                                                            {/* stderr */}
                                                                            {subTask.stderr &&
                                                                                <Card className="mb-3">
                                                                                    <Card.Header>stderr</Card.Header>
                                                                                    <Card.Body className="bg-light">
                                                                                        <pre className="mb-0">
                                                                                            <code>
                                                                                                {subTask.stderr}
                                                                                            </code>
                                                                                        </pre>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            }

                                                                            {/* Message */}
                                                                            {subTask.message &&
                                                                                <Card className="mb-3">
                                                                                    <Card.Header>Message</Card.Header>
                                                                                    <Card.Body className="bg-light">
                                                                                        <pre className="mb-0">
                                                                                            <code>
                                                                                                {subTask.message}
                                                                                            </code>
                                                                                        </pre>
                                                                                    </Card.Body>
                                                                                </Card>
                                                                            }

                                                                            {/* Statistics */}
                                                                            <Row>
                                                                                {subTask.time &&
                                                                                    <Col md={6}>
                                                                                        <p>Time: {subTask.time}</p>
                                                                                    </Col>
                                                                                }
                                                                                {subTask.memory &&
                                                                                    <Col md={6}>
                                                                                        <p>Memory: {subTask.memory}</p>
                                                                                    </Col>
                                                                                }
                                                                            </Row>

                                                                            {/* Token */}
                                                                            <Row className="mb-0">
                                                                                <Col md={12}>
                                                                                    <p>Token: {subTask.token}</p>
                                                                                </Col>
                                                                            </Row>
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                );
                                                            })}
                                                        </Accordion>
                                                    </Container>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => setOpenModalIndex(-1)}
                                                    >
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                            <Row className="mb-1">
                                                <div style={{ marginBottom: "1rem" }}>
                                                    <CodeEditor
                                                        height="20rem"
                                                        language={Language[item.language_id][1]}
                                                        theme="vs-dark"
                                                        value={item.code}
                                                        options={{
                                                            selectOnLineNumbers: true,
                                                            fontSize: 18,
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </div>
                                            </Row>
                                        </Container>
                                    </Tab>
                                );
                            })}
                        </Tabs>
                    </div>
                }

            </div>

            <AlertMessage show={alertStatus} text={alert_text} varient={alert_variant} />
        </>
    );
}