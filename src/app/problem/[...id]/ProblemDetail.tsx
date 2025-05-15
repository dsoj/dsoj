"use client";
import ErrorPage from 'next/error';
import { DifficultyElement, TagElement } from "@/component/ListElement";
import { IProblem } from "@/interface/IProblem";
import AlertMessage from "@/component/Alert";
import { useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Editor as CodeEditor } from "@monaco-editor/react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Link from 'next/link';
import { Language } from '@/constant/Judge';
import { getCookie } from 'cookies-next';
import { useSession } from '@/context/sessionState';

export default function ProblemDetail({ problem_id }: { problem_id: string; }) {
    const [problemDetail, setProblemDetail] = useState<IProblem | null>(null);
    const [submissionResult, setSubmissionResult] = useState<any[]>([]);
    const [isNotFound, setIsNotFound] = useState<boolean | null>(null);

    // alert popup
    const [alertStatus, setAlertStatus] = useState<boolean>(false);
    const [alert_text, setAlertText] = useState<string>('');
    const [alert_variant, setAlertVariant] = useState<string>('success');

    const { isLoggedIn, setIsLoggedIn } = useSession();

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

    // Fetch Submission result
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        const username = getCookie('username');
        fetch(`/api/submission?problem_id=${problem_id}&username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSubmissionResult(data.data);
                }
            });
    }, [problem_id, isLoggedIn]);



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


                {(submissionResult.length > 0) &&
                    <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                        <h4>Submissions</h4>
                        <Tabs defaultActiveKey="0" className="mb-3">
                            {submissionResult.map((item: any, index: number) => {
                                const title = `${item.status} ${new Date(item.send_time).toLocaleDateString()}-${Language[item.language_id][0]}`;
                                return (
                                    <Tab eventKey={index} title={title} key={index}>
                                        <div className="container" style={{ textAlign: 'center' }}>
                                            <div className="row mb-1">
                                                <div className="col-md-6">
                                                    <span>Time: &nbsp; {new Date(item.send_time).toLocaleString()}</span>
                                                </div>
                                                <div className="col-md-6">
                                                    <span>Language: &nbsp; {Language[item.language_id][0]}</span>
                                                </div>
                                            </div>

                                            <div className="row mb-1">
                                                <div className="col-md-6">
                                                    <span>Status: &nbsp;
                                                        {(item.status === "Accepted") ?
                                                            <span className="badge text-bg-success">{item.status}</span> :
                                                            <span className="badge text-bg-danger">{item.status}</span>
                                                        }
                                                    </span>
                                                </div>

                                                {/* Modal Trigger */}
                                                <div className="col-md-6">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#subTaskModal-${index}`}
                                                    >
                                                        SubTasks
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Modal */}
                                            <div
                                                className="modal fade"
                                                id={`subTaskModal-${index}`}
                                                tabIndex={-1}
                                                aria-labelledby={`subTaskModalLabel-${index}`}
                                                aria-hidden="true"
                                            >
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h1 className="modal-title fs-5" id={`subTaskModalLabel-${index}`}>
                                                                {title}
                                                            </h1>
                                                            <button
                                                                type="button"
                                                                className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"
                                                            />
                                                        </div>
                                                        <div className="modal-body">...</div>
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                data-bs-dismiss="modal"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-1">
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
                                            </div>
                                        </div>
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