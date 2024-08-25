import { MongoClient } from "mongodb";
import Layout from '@/components/Layout';
import ErrorPage from 'next/error';

import EnvVars from "@/constants/EnvVars";
import { DifficultyElement, TagElement } from "@/lib/problem_elements";
import { IProblem } from "@/interface/IProblem";
import AlertMessage from "@/components/alert";
import { useState } from "react";

export default function ProblemDetail({ problemDetail }: { problemDetail: IProblem }) {
    const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
    if (!problemDetail) {
        return (
            <ErrorPage statusCode={404} />
        )
    }
    const { id, title, details, samples, tags, difficulty, accepted, submissions } = problemDetail;

    function copyToClipboard(content: string) {
        navigator.clipboard.writeText(content);
        setCopiedStatus(true)
        setTimeout(() => {
            setCopiedStatus(false);
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

    return (
        // TODO: Elements have to be convert to react-bootstrap components
        <Layout>
            <div style={{ padding: '2rem', background: "#ededed" }}>
                <div style={{ background: '#ffffff', borderRadius: '29px', padding: '1.5rem', boxShadow: '0px 0px 3px 0px', marginBottom: '1rem' }}>
                    <h2>{id}. {title}&nbsp;
                        <a href={`/submit/${id}`} style={{ borderColor: 'var(--bs-form-valid-color)', color: 'var(--bs-form-valid-color)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-arrow-up-square">
                                <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                            </svg>
                        </a>
                    </h2>
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
                    <a className="btn btn-primary" type="button" href={`/submit/${id}`} style={{ background: 'var(--bs-form-valid-color)', borderStyle: 'none' }}>Submit</a>
                    <code-input language="HTML"></code-input>
                </div>

            </div>
            <AlertMessage show={copiedStatus} text="Copied!" />
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
