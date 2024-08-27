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

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function ProblemDetail({ problemDetail }: { problemDetail: IProblem }) {
    const router = useRouter();
    
    // submit block 
    const [source_code, setSourceCode] = useState('');
    const [language_id, setLanguage_id] = useState(71);

    // alert popup
    const [alertStatus, setAlertStatus] = useState<boolean>(false);
    const [alert_text, setAlertText] = useState<string>('');
    const [alert_variant, setAlertVariant] = useState<string>('success');

    if (!problemDetail) {
        return (
            <ErrorPage statusCode={404} />
        )
    }
    const { id, title, details, samples, tags, difficulty, accepted, submissions } = problemDetail;

    async function submit() {
        if (source_code === "") {
            setAlertText('Please enter your code!');
            setAlertVariant('danger');
            setAlertStatus(true);
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

    function copyToClipboard(content: string) {
        navigator.clipboard.writeText(content);
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
                    <div className="col-md-6" style={{ paddingRight: '0.5rem', paddingLeft: '0px' }} onClick={(e) => copyToClipboard(sample.input)}>
                        <div className="sample" style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                            <h4>Sample Input {i}</h4>
                            <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.input}</span>
                        </div>
                    </div>
                    <div className="col-md-6" style={{ paddingLeft: '0.5rem', paddingRight: '0px' }} onClick={(e) => copyToClipboard(sample.output)}>
                        <div className="sample" style={{ borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem', background: '#ffffff' }}>
                            <h4>Sample Output {i}</h4>
                            <span style={{ color: 'rgb(51, 51, 51)', whiteSpace: 'pre-line' }}>{sample.output}</span>
                        </div>
                    </div>
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
                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                    <h3>Submit</h3>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <select style={{ marginRight: '0.5rem' }} value={language_id} onChange={(e) => setLanguage_id(parseInt(e.target.value))} >
                            <option value="71" defaultChecked>C++</option>
                            <option value="63">Python3</option>
                        </select>
                        <button style={{ marginRight: '0.5rem', marginTop: '0.5rem', borderStyle: 'none' }} className="btn btn-primary bg-success" onClick={submit}><i className="bi bi-file-earmark-arrow-up-fill"></i> Submit</button>
                        <button style={{ marginTop: '0.5rem', borderStyle: 'none' }} className="btn btn-primary bg-primary" onClick={submit}><i className="bi bi-play-fill"></i> Test</button> {/* TODO: Onclick test */}
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

                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
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

            </div>
            <AlertMessage show={alertStatus} text={alert_text} varient={alert_variant} />
        </Layout>
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
