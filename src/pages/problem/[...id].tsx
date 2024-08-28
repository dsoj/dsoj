import { MongoClient } from "mongodb";
import Layout from '@/components/Layout';
import ErrorPage from 'next/error';

import EnvVars from "@/constants/EnvVars";
import { DifficultyElement, TagElement } from "@/components/list_element";
import { IProblem } from "@/interface/IProblem";
import AlertMessage from "@/components/alert";
import { useState } from "react";
import { Editor as CodeEditor } from "@monaco-editor/react";
import apiUrl from "@/constants/apiUrl";
import axios from "axios";
import { useRouter } from "next/router";

import Image from 'next/image';
import coder from '@/assets/coder.png';
import ac_res from '@/assets/ac_res.png';
import bad_res from '@/assets/bad_res.png'

import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { authentication } from "@/lib/auth";
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function ProblemDetail({ problemDetail }: { problemDetail: IProblem }) {
    const router = useRouter();
    const [submit_status, setSubmitStatus] = useState<boolean>(false);

    // submit block 
    const [source_code, setSourceCode] = useState('');
    const [language_id, setLanguage_id] = useState(54);

    // alert popup
    const [alertStatus, setAlertStatus] = useState<boolean>(false);
    const [alert_text, setAlertText] = useState<string>('');
    const [alert_variant, setAlertVariant] = useState<string>('success');

    // session 
    const [sessionState, setSessionState] = useState(-1);
    (async () => {
        setSessionState(await authentication());
    })();

    if (!problemDetail) {
        return (
            <ErrorPage statusCode={404} />
        )
    }
    const { id, title, details, samples, tags, difficulty, accepted, submissions } = problemDetail;

    async function submit() {
        setSubmitStatus(true);
        if (source_code === "") {
            setAlertText('Please enter your code!');
            setAlertVariant('danger');
            setAlertStatus(true);
            setSubmitStatus(false);
            return
        }

        const submit_api_url = apiUrl.judge0.submit;
        axios.post(submit_api_url, {
            id: id,
            code: source_code,
            language_id: language_id,
        })
            .then(() => {
                router.push('/problem');
            })
    }

    function doCopyEffect() {
        setAlertText('Copied!');
        setAlertVariant('success');
        setAlertStatus(true);
        setTimeout(() => {
            setAlertStatus(false);
        }, 1000);
    }

    function GenExamples() {
        let renderElement: React.JSX.Element[] = [];
        for (let i = 1; i <= samples.length; i++) {
            const sample = samples[i - 1];
            renderElement.push(
                <div className="row" style={{ margin: '0px' }} key={i}>
                    <CopyToClipboard text={sample.input} onCopy={doCopyEffect}>
                        <div className="col-md-6" style={{ paddingRight: '0.5rem', paddingLeft: '0px' }}>
                            <div className="sample" style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                                <h4>Sample Input {i}</h4>
                                <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.input}</span>
                            </div>
                        </div>
                    </CopyToClipboard>
                    
                    <CopyToClipboard text={sample.output} onCopy={doCopyEffect}>
                    <div className="col-md-6" style={{ paddingLeft: '0.5rem', paddingRight: '0px' }}>
                        <div className="sample" style={{ borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem', background: '#ffffff' }}>
                            <h4>Sample Output {i}</h4>
                            <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.output}</span>
                        </div>
                    </div>
                    </CopyToClipboard>
                </div>
            )
        }
        return (
            <div>
                {renderElement}
            </div>
        )
    }

    return (
        // TODO: Elements have to be convert to react-bootstrap components
        <Layout>
            <div style={{ padding: '2rem', background: "#ededed" }}>
                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                    <h2>{id}. {title}&nbsp;</h2>
                    <div style={{ marginBottom: "1rem" }}>
                        <DifficultyElement difficulty={difficulty} />
                        {tags.map((item) => TagElement(item))}
                    </div>
                    <p style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}> {details} </p>

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
                <GenExamples />
                <div
                    id="submit-block"
                    style={{
                        background: '#ffffff',
                        borderRadius: '29px',
                        padding: '1.5rem',
                        boxShadow: '0px 0px 3px 0px',
                        marginBottom: '1rem'
                    }}
                    hidden={sessionState == 0}>
                    <h3>Submit</h3>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <select style={{ marginRight: '0.5rem' }} value={language_id} onChange={(e) => setLanguage_id(parseInt(e.target.value))} disabled={submit_status}>
                            <option value="54" defaultChecked>C++ (GCC 9.2.0)</option>
                            <option value="71">Python (3.8.1)</option>
                        </select>
                        <button style={{ marginRight: '0.5rem', marginTop: '0.5rem', borderStyle: 'none' }} className="btn btn-primary bg-success" onClick={submit} disabled={submit_status}>
                            {(!submit_status) ?
                                <span><i className="bi bi-file-earmark-arrow-up-fill"></i> Submit </span> :
                                <Spinner size="sm" animation="grow" role="status">
                                    <span className="visually-hidden">Submitting...</span>
                                </Spinner>
                            }
                        </button>
                        <button style={{ marginTop: '0.5rem', borderStyle: 'none' }} className="btn btn-primary bg-primary" onClick={submit} hidden={true}><i className="bi bi-play-fill"></i> Test</button> {/* TODO: Onclick test */}
                    </div>
                    <CodeEditor
                        height="20rem"
                        language={language_id === 71 ? 'cpp' : 'python'}
                        theme="vs-dark"
                        value={source_code}
                        onChange={(value) => setSourceCode(value ?? '')}
                        options={{
                            selectOnLineNumbers: true,
                            fontSize: 18,
                        }}
                    />
                </div>

                <div style={{
                    background: '#ffffff',
                    borderRadius: '29px',
                    padding: '1.5rem',
                    boxShadow: '0px 0px 3px 0px',
                    marginBottom: '1rem'
                }}
                    hidden={true} // TODO: Comming soon
                >
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
                        <Tab eventKey="whatever" title="+"> {/* TODO: User add more test cases */}
                            not done yet
                        </Tab>
                    </Tabs>
                </div>

                <div
                    style={{
                        background: '#ffffff',
                        borderRadius: '29px',
                        padding: '1.5rem',
                        boxShadow: '0px 0px 3px 0px',
                        marginBottom: '1rem'
                    }}
                    hidden={sessionState == 0}>
                    <h3>Result</h3>
                    <div> {/* if not submitted yet */}
                        <Image src={coder.src} width="100" height="100" alt="coder" />
                        <p style={{ color: "gray", fontFamily: "monospace" }}><i><a href="#submit-block">Submit</a> to see the result!</i></p>
                    </div>
                    <div> {/* if submitted */}
                        <div> {/* if AC */}
                            <Image src={ac_res.src} width="100" height="100" alt="coder" />
                            <h5 style={{ color: "rgb(0, 135, 114)", fontFamily: "monospace" }}>Accepted</h5>

                            <div>
                                <span style={{ fontSize: 24 }}>
                                    <strong>{accepted}</strong>
                                </span>
                                <span style={{ marginRight: "3rem" }}>
                                    &nbsp;ms&nbsp;
                                    &nbsp;
                                </span>
                                <span style={{ fontSize: 24 }}>
                                    <strong>{submissions}</strong>
                                </span>
                                <span style={{ marginRight: "3rem" }}>
                                    &nbsp;MB&nbsp;
                                    &nbsp;
                                </span>
                                <span>
                                    Acceptance Rate&nbsp;&nbsp;
                                    <span style={{ fontSize: 24 }}>
                                        <strong>{Math.round((100 * accepted) / submissions)}%</strong>
                                    </span>
                                    &nbsp;
                                </span>
                                <br />
                                <CopyToClipboard text={"source_code"}>
                                    <button>Copy</button>
                                    {/* onClick={() => navigator.clipboard.writeText("hi")} */}
                                </CopyToClipboard>
                                <CodeEditor
                                    height="20rem"
                                    language={language_id === 71 ? 'cpp' : 'python'}
                                    theme="vs-dark"
                                    value={"source_code"}
                                    onChange={(value) => { }}
                                    options={{
                                        selectOnLineNumbers: true,
                                        fontSize: 18,
                                        readOnly: true,
                                    }}
                                />
                            </div>
                        </div>
                        <div> {/* if not AC */}
                            <Image src={bad_res.src} width="100" height="100" alt="coder" />
                            <h5 style={{ color: "rgb(229, 4, 59)", fontFamily: "monospace" }}>Wrong Answer</h5>
                        </div>
                    </div>
                </div>

            </div>
            <AlertMessage show={alertStatus} text={alert_text} varient={alert_variant} />
        </Layout >
    )
}

export async function getServerSideProps(context: any) {
    const mongoURI = EnvVars.DB.URI;
    const mongo = new MongoClient(mongoURI);

    const id = context.query.id[0];

    let problemDetail = (await mongo
        .db("Judge")
        .collection("Problems")
        .findOne({ id: id }, { projection: { _id: 0 } })
        .catch((err) => {
            console.error(err);
            return [];
        }))
    return {
        props: {
            problemDetail,
        },
    };
}
