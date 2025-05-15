"use client";
import ErrorPage from 'next/error';
import { useCallback, useEffect, useState } from 'react';
import { Editor as CodeEditor } from "@monaco-editor/react";
import AlertMessage from "@/component/Alert";
import { IProblem } from '@/interface/IProblem';
import { Language, SubmitMethodID } from '@/constant/Judge';
import { TextLeft, FileEarmarkCode } from 'react-bootstrap-icons';
import Link from 'next/link';

export default function Submit({ problem_id }: { problem_id: string; }) {
    const [problemDetail, setProblemDetail] = useState<IProblem | null>(null);
    const [isNotFound, setIsNotFound] = useState<boolean | null>(null);
    // alert popup
    const [alert_status, setAlertStatus] = useState<boolean>(false);
    const [alert_text, setAlertText] = useState<string>('');
    const [alert_variant, setAlertVariant] = useState<string>('success');

    // states
    const [language_id, setCompilerID] = useState<number>(1);
    const [method, setMethod] = useState<number>(SubmitMethodID.TEXT);
    const [code, setCode] = useState<string>('');

    const Submit = useCallback(() => {
        if (code.length === 0) {
            setAlertText('Code is empty!');
            setAlertVariant('danger');
            setAlertStatus(true);
            return;
        }

        fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                problem_id: problem_id,
                language_id: language_id,
                code: code,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    setAlertText('Submit success!');
                    setAlertVariant('success');
                    setAlertStatus(true);
                } else {
                    setAlertText(data.message);
                    setAlertVariant('danger');
                    setAlertStatus(true);
                }
            });
    }, [code, language_id, problem_id]);


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

    return (
        <div style={{ padding: "2rem" }}>
            {/* Heading START*/}
            <h1>
                New submission&nbsp;
                <Link href={`/problem/${problem_id}`}>
                    <span style={{ fontSize: "0.75em" }}>
                        <span style={{ color: "rgb(84, 84, 84)" }}>
                            {problemDetail?.id}. {problemDetail?.title}&nbsp;
                        </span>&nbsp;
                    </span>
                </Link>
            </h1>
            {/* Heading END */}

            {/* Compiler selector START*/}
            <div className="dropdown" style={{ marginBottom: "1rem" }}>
                <button
                    className="btn btn-primary dropdown-toggle"
                    aria-expanded="false"
                    data-bs-toggle="dropdown"
                    type="button"
                    id="dropdownMenuButton"
                >
                    {Language[language_id][0]}&nbsp;
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {
                        Object.entries(Language).map((item) => {
                            return (
                                <a
                                    key={Number(item[0])}
                                    className="dropdown-item"
                                    href="#"
                                    onClick={() => {
                                        setCompilerID(Number(item[0]));
                                    }}
                                >
                                    {item[1][0]}
                                </a>
                            );
                        })
                    }
                </div>
            </div>
            {/* Compiler selector END */}

            {/* Method Select START */}
            <div className="col-md-6">
                <div className="row" style={{ margin: 0, marginBottom: "1rem" }}>
                    {/* Text Editor */}
                    <div
                        className="col"
                        style={{ paddingRight: "0.5rem", paddingLeft: 0 }}
                    >
                        <div
                            className="btn sample w-100"
                            style={{
                                borderRadius: 29,
                                padding: "1rem",
                                boxShadow: "0px 0px 3px 0px",
                                marginBottom: "1rem",
                                background: "var(--bs-primary-border-subtle)",
                                marginLeft: "1rem"
                            }}
                            onClick={() => {
                                setMethod(SubmitMethodID.TEXT);
                            }}
                        >
                            <TextLeft fontSize={35} width={'1em'} height={'1em'} />
                            <span>Text editor</span>
                        </div>
                    </div>
                    {/* File Upload */}
                    <div
                        className="col"
                        style={{ paddingRight: "0.5rem", paddingLeft: 0 }}
                    >
                        <div
                            className="btn sample w-100"
                            style={{
                                borderRadius: 29,
                                padding: "1rem",
                                boxShadow: "0px 0px 3px 0px",
                                marginBottom: "1rem",
                                background: "var(--bs-warning-border-subtle)",
                                marginLeft: "1rem"
                            }}
                            onClick={() => {
                                setMethod(SubmitMethodID.FILE);
                            }}
                        >
                            <FileEarmarkCode fontSize={35} width={'1em'} height={'1em'} />
                            <span>File Upload</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Method Select END */}

            {/* Code Editor START */}
            {(method === SubmitMethodID.TEXT) && (
                <div style={{ marginBottom: "1rem" }}>
                    <CodeEditor
                        height="20rem"
                        language={Language[language_id][1]}
                        theme="vs-dark"
                        value={code}
                        options={{
                            selectOnLineNumbers: true,
                            fontSize: 18,
                            readOnly: false,
                        }}
                        onChange={(value) => {
                            setCode(value || '');
                        }}
                    />
                </div>
            )}
            {/* Code Editor END */}

            {/* File Upload START */}
            {(method === SubmitMethodID.FILE) && (
                <div style={{ marginBottom: "1rem" }}>
                    <input type="file" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                setCode(event.target?.result as string);
                                setMethod(SubmitMethodID.TEXT); // Switch back to text editor after file upload
                            };
                            reader.readAsText(file);
                        }
                    }} />
                </div>
            )}
            {/* File Upload END */}

            {/* Submit Button START */}
            <button
                className="btn btn-primary"
                type="button"
                style={{ background: "var(--bs-form-valid-color)", borderStyle: "none" }}
                onClick={Submit}
            >
                Submit
            </button>
            {/* Submit Button END */}
        </div>
    );
}