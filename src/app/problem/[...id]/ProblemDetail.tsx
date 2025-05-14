"use client";
import ErrorPage from 'next/error';
import { DifficultyElement, TagElement } from "@/component/ListElement";
import { IProblem } from "@/interface/IProblem";
import AlertMessage from "@/component/Alert";
import { useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Link from 'next/link';

export default function ProblemDetail({ problem_id }: { problem_id: string; }) {
    const [problemDetail, setProblemDetail] = useState<IProblem | null>(null);
    const [isNotFound, setIsNotFound] = useState<boolean | null>(null);

    // alert popup
    const [alertStatus, setAlertStatus] = useState<boolean>(false);
    const [alert_text, setAlertText] = useState<string>('');
    const [alert_variant, setAlertVariant] = useState<string>('success');

    // Fetch Detail data
    useEffect(() => {
        fetch(`/api/problem/${problem_id}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.problemDetail) {
                    setIsNotFound(true);
                    return;
                }
                setProblemDetail(data.problemDetail);
                setIsNotFound(false);
            });
    }, [problem_id]);

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


    function doCopyEffect() {
        setAlertText('Copied!');
        setAlertVariant('success');
        setAlertStatus(true);
        setTimeout(() => {
            setAlertStatus(false);
        }, 1000);
    }

    return (
        <>
            <div style={{ padding: '2rem', background: "#ededed" }}>
                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                    <h2>{id}. {title}&nbsp;
                        <Link href={`/submit/${problem_id}/`}>
                            <button
                                className="btn btn-primary"
                                type="button"
                                style={{ background: "var(--bs-form-valid-color)", borderStyle: "none" }}
                            >
                                Submit
                            </button>
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
                        <div className="row" style={{ margin: '0px' }} key={index}>
                            <CopyToClipboard text={sample.input} onCopy={doCopyEffect}>
                                <div className="col-md-6" style={{ paddingRight: '0.5rem', paddingLeft: '0px' }}>
                                    <div className="sample" style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                                        <h4>Sample Input {index}</h4>
                                        <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.input}</span>
                                    </div>
                                </div>
                            </CopyToClipboard>

                            <CopyToClipboard text={sample.output} onCopy={doCopyEffect}>
                                <div className="col-md-6" style={{ paddingLeft: '0.5rem', paddingRight: '0px' }}>
                                    <div className="sample" style={{ borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem', background: '#ffffff' }}>
                                        <h4>Sample Output {index}</h4>
                                        <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.output}</span>
                                    </div>
                                </div>
                            </CopyToClipboard>
                        </div>
                    );
                })}

                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                    <h4>Submissions</h4>
                    <Tabs defaultActiveKey="c1" className="mb-3">
                        <Tab eventKey="c1" title="Case 1">
                            <div className="container" style={{ textAlign: 'center' }}>
                                <div className="row">
                                    <div className="col-md-6"><span>Test Input 1</span></div>
                                    <div className="col-md-6"><span>Test Output 1</span></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                        <textarea style={{
                                            height: '6rem', resize: 'none',
                                            width: '20rem'
                                        }} defaultValue={""} /> {/* TODO: Add sample input */}
                                    </div>
                                    <div className="col-md-6">
                                        <textarea style={{ height: '6rem', resize: 'none', width: '20rem' }}
                                            defaultValue={""} /> {/* TODO: Add sample output */}
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="c2" title="Case 2">
                            <div className="container" style={{ textAlign: 'center' }}>
                                <div className="row">
                                    <div className="col-md-6"><span>Test Input 2</span></div>
                                    <div className="col-md-6"><span>Test Output 2</span></div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 col-lg-6"><textarea style={{
                                        height: '6rem', resize: 'none',
                                        width: '20rem'
                                    }} defaultValue={""} /></div>
                                    <div className="col-md-6"><textarea style={{ height: '6rem', resize: 'none', width: '20rem' }}
                                        defaultValue={""} /></div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>

            </div>

            <AlertMessage show={alertStatus} text={alert_text} varient={alert_variant} />
        </>
    );
}