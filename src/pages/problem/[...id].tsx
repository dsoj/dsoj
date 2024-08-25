import { MongoClient } from "mongodb";
import Layout from '@/components/Layout';
import ErrorPage from 'next/error';

import EnvVars from "@/constants/EnvVars";
import { DifficultyElement, TagElement } from "@/lib/problem_elements";
import { IProblem } from "@/interface/IProblem";
import AlertMessage from "@/components/alert";
import { useState } from "react";
import { Editor as CodeEditor } from "@monaco-editor/react";
import apiUrl from "@/constants/apiUrl";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProblemDetail({ problemDetail }: { problemDetail: IProblem }) {
    const router = useRouter();
    const [alertStatus, setAlertStatus] = useState<boolean>(false);
    const [language_id, setLanguage_id] = useState(71);
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
            // TODO: add a copy appearance effect to the sample input and output
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

    function GenTags() {
        let renderElement: React.JSX.Element[] = [];
        for (let i = 1; i <= tags.length; i++) {
            const tag = tags[i - 1];
            renderElement.push(TagElement(tag));
        }

        return renderElement;
    }

    const [source_code, setSourceCode] = useState(''); // TODO: source_code 

    return (
        // TODO: Elements have to be convert to react-bootstrap components
        <Layout>
            <div style={{ padding: '2rem', background: "#ededed" }}>
                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                    <h2>{id}. {title}&nbsp;</h2>
                    <div style={{ marginBottom: "1rem" }}>
                        <DifficultyElement difficulty={difficulty} />
                        <GenTags />
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


                    <select style={{ marginBottom: '0.5rem' }} value={language_id} onChange={(e) => setLanguage_id(parseInt(e.target.value))} >
                        <option value="71" defaultChecked>C++</option>
                        <option value="63">Python3</option>
                    </select>
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
                    <button style={{ marginTop: '0.5rem', background: 'var(--bs-form-valid-color)', borderStyle: 'none' }} className="btn btn-primary" onClick={submit}>Submit</button>
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
