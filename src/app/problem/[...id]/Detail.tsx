"use client";
import ErrorPage from 'next/error';
import { DifficultyElement, TagElement } from "@/app/problem/ListElement";
import { IProblem } from "@/interface/IProblem";
import AlertMessage from "@/components/alert";
import { useCallback, useEffect, useState } from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function ProblemDetail({ problem_id }: { problem_id: string; }) {
    const [submit_status, setSubmitStatus] = useState<boolean>(false);
    const [problemDetail, setProblemDetail] = useState<IProblem | null>(null);
    const [isNotFound, setIsNotFound] = useState<boolean | null>(null);

    // submit block 
    const [source_code, setSourceCode] = useState('');
    const [language_id, setLanguage_id] = useState(54);

    // alert popup
    const [alertStatus, setAlertStatus] = useState<boolean>(false);
    const [alert_text, setAlertText] = useState<string>('');
    const [alert_variant, setAlertVariant] = useState<string>('success');

    // session 
    // TODO: fix session logic
    // const [sessionState, setSessionState] = useState(-1);

    // useEffect(() => {
    //     (async () => {
    //         setSessionState(await authentication());
    //     })();
    // });

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
    }, []);

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



    // const submit = useCallback(async () => {
    //     setSubmitStatus(true);
    //     if (source_code === "") {
    //         setAlertText('Please enter your code!');
    //         setAlertVariant('danger');
    //         setAlertStatus(true);
    //         setSubmitStatus(false);
    //         return;
    //     }
    //     try {
    //         const submit_api_url = apiUrl.judge0.submit;
    //         axios.post(submit_api_url, {
    //             id: id,
    //             code: source_code,
    //             language_id: language_id,
    //         })
    //             .then(() => {
    //                 // VAILD: redirect to problem list page
    //                 redirect('/problem');
    //             });
    //     } catch (err) {
    //         console.error(err);
    //         setAlertText('Submit failed!');
    //         setAlertVariant('danger');
    //         setAlertStatus(true);
    //         setTimeout(() => {
    //             setAlertStatus(false);
    //         }, 1000);
    //     }
    // }, [setAlertStatus, setAlertText, setAlertVariant, setSubmitStatus, source_code, language_id, id]);




    // function ResultBlock() {
    //     // TODO: CE RE TLE MLE
    //     let ele = <></>;
    //     if (result.ac.length == 0 && result.wa.length == 0) {
    //         ele = (
    //             <div> {/* if not submitted yet */}
    //                 <Image src={coder.src} width="100" height="100" alt="coder" />
    //                 <p style={{ color: "gray", fontFamily: "monospace" }}><i><a href="#submit-block">Submit</a> to see the result!</i></p>
    //             </div>
    //         );
    //     } else if (result.ac.length > 0) {
    //         // const time = result.ac[0].submissions[0].time;
    //         // const memory = result.ac[0].submissions[0].memory;
    //         ele = (
    //             <div> {/* if AC */}
    //                 <Image src={ac_res.src} width="100" height="100" alt="coder" />
    //                 <h5 style={{ color: "rgb(0, 135, 114)", fontFamily: "monospace" }}>Accepted</h5>

    //                 <div>
    //                     {/* <span style={{ fontSize: 24 }}>
    //                         <strong>{result.ac[0].time}</strong>
    //                     </span>
    //                     <span style={{ marginRight: "3rem" }}>
    //                         &nbsp;ms&nbsp;
    //                         &nbsp;
    //                     </span>
    //                     <span style={{ fontSize: 24 }}>
    //                         <strong>{result.ac[0].time}</strong>
    //                     </span>
    //                     <span style={{ marginRight: "3rem" }}>
    //                         &nbsp;MB&nbsp;
    //                         &nbsp;
    //                     </span>
    //                     <span>
    //                         Acceptance Rate&nbsp;&nbsp;
    //                         <span style={{ fontSize: 24 }}>
    //                             <strong>{Math.round((100 * accepted) / submissions)}%</strong>
    //                         </span>
    //                         &nbsp;
    //                     </span> */}
    //                     <p>{(result.ac[result.ac.length - 1].language_id == 71) ? 'Python (3.8.1)' : 'C++ (GCC 9.2.0)'}</p>
    //                     {/* <CopyToClipboard text={result.ac[result.ac.length - 1].code} onCopy={doCopyEffect}> */}
    //                     <CopyToClipboard text={result.ac.at(-1).code} onCopy={doCopyEffect}>
    //                         <Button variant="secondary"><i className="bi bi-copy"></i></Button>
    //                     </CopyToClipboard>
    //                     <div style={{ marginTop: '0rem' }}>
    //                         <CodeEditor
    //                             height="20rem"
    //                             language={result.ac[0].language_id === 71 ? 'python' : 'cpp'}
    //                             theme="vs-dark"
    //                             value={result.ac[0].code}
    //                             options={{
    //                                 selectOnLineNumbers: true,
    //                                 fontSize: 18,
    //                                 readOnly: true,
    //                             }}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     } else if (result.wa.length > 0) {
    //         ele = (
    //             <div> {/* if not AC */}
    //                 <Image src={bad_res.src} width="100" height="100" alt="coder" />
    //                 <h5 style={{ color: "rgb(229, 4, 59)", fontFamily: "monospace" }}>Failed</h5>

    //                 <div>
    //                     <p>{(result.wa[result.wa.length - 1].language_id == 71) ? 'Python (3.8.1)' : 'C++ (GCC 9.2.0)'}</p>
    //                     <CopyToClipboard text={result.wa[result.wa.length - 1].code}>
    //                         <Button variant="secondary">Copy</Button>
    //                     </CopyToClipboard>
    //                     <div style={{ marginTop: '1rem' }}>
    //                         <CodeEditor
    //                             height="20rem"
    //                             language={result.wa[0].language_id === 71 ? 'cpp' : 'python'}
    //                             theme="vs-dark"
    //                             value={result.wa[0].code}
    //                             options={{
    //                                 selectOnLineNumbers: true,
    //                                 fontSize: 18,
    //                                 readOnly: true,
    //                             }}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     }
    //     return (
    //         <div
    //             style={{
    //                 background: '#ffffff',
    //                 borderRadius: '29px',
    //                 padding: '1.5rem',
    //                 boxShadow: '0px 0px 3px 0px',
    //                 marginBottom: '1rem'
    //             }}
    //             hidden={sessionState == 0}>
    //             <h3>Result</h3>
    //             {ele}

    //         </div>
    //     );
    // }

    function doCopyEffect() {
        setAlertText('Copied!');
        setAlertVariant('success');
        setAlertStatus(true);
        setTimeout(() => {
            setAlertStatus(false);
        }, 1000);
    }

    // COMPONENTS START
    // HERE
    function Results() {
        // let ele = <></>;
        //     if (result.ac.length == 0 && result.wa.length == 0) {
        //         ele = (
        //             <div> {/* if not submitted yet */}
        //                 <Image src={coder.src} width="100" height="100" alt="coder" />
        //                 <p style={{ color: "gray", fontFamily: "monospace" }}><i><a href="#submit-block">Submit</a> to see the result!</i></p>
        //             </div>
        //         );
        //     } else if (result.ac.length > 0) {
        //         // const time = result.ac[0].submissions[0].time;
        //         // const memory = result.ac[0].submissions[0].memory;
        //         ele = (
        //             <div> {/* if AC */}
        //                 <Image src={ac_res.src} width="100" height="100" alt="coder" />
        //                 <h5 style={{ color: "rgb(0, 135, 114)", fontFamily: "monospace" }}>Accepted</h5>

        //                 <div>
        //                     {/* <span style={{ fontSize: 24 }}>
        //                         <strong>{result.ac[0].time}</strong>
        //                     </span>
        //                     <span style={{ marginRight: "3rem" }}>
        //                         &nbsp;ms&nbsp;
        //                         &nbsp;
        //                     </span>
        //                     <span style={{ fontSize: 24 }}>
        //                         <strong>{result.ac[0].time}</strong>
        //                     </span>
        //                     <span style={{ marginRight: "3rem" }}>
        //                         &nbsp;MB&nbsp;
        //                         &nbsp;
        //                     </span>
        //                     <span>
        //                         Acceptance Rate&nbsp;&nbsp;
        //                         <span style={{ fontSize: 24 }}>
        //                             <strong>{Math.round((100 * accepted) / submissions)}%</strong>
        //                         </span>
        //                         &nbsp;
        //                     </span> */}
        //                     <p>{(result.ac[result.ac.length - 1].language_id == 71) ? 'Python (3.8.1)' : 'C++ (GCC 9.2.0)'}</p>
        //                     {/* <CopyToClipboard text={result.ac[result.ac.length - 1].code} onCopy={doCopyEffect}> */}
        //                     <CopyToClipboard text={result.ac.at(-1).code} onCopy={doCopyEffect}>
        //                         <Button variant="secondary"><i className="bi bi-copy"></i></Button>
        //                     </CopyToClipboard>
        //                     <div style={{ marginTop: '0rem' }}>
        //                         <CodeEditor
        //                             height="20rem"
        //                             language={result.ac[0].language_id === 71 ? 'python' : 'cpp'}
        //                             theme="vs-dark"
        //                             value={result.ac[0].code}
        //                             options={{
        //                                 selectOnLineNumbers: true,
        //                                 fontSize: 18,
        //                                 readOnly: true,
        //                             }}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>
        //         );
        //     } else if (result.wa.length > 0) {
        //         ele = (
        //             <div> {/* if not AC */}
        //                 <Image src={bad_res.src} width="100" height="100" alt="coder" />
        //                 <h5 style={{ color: "rgb(229, 4, 59)", fontFamily: "monospace" }}>Failed</h5>

        //                 <div>
        //                     <p>{(result.wa[result.wa.length - 1].language_id == 71) ? 'Python (3.8.1)' : 'C++ (GCC 9.2.0)'}</p>
        //                     <CopyToClipboard text={result.wa[result.wa.length - 1].code}>
        //                         <Button variant="secondary">Copy</Button>
        //                     </CopyToClipboard>
        //                     <div style={{ marginTop: '1rem' }}>
        //                         <CodeEditor
        //                             height="20rem"
        //                             language={result.wa[0].language_id === 71 ? 'cpp' : 'python'}
        //                             theme="vs-dark"
        //                             value={result.wa[0].code}
        //                             options={{
        //                                 selectOnLineNumbers: true,
        //                                 fontSize: 18,
        //                                 readOnly: true,
        //                             }}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>
        //         );
        //     }
        //     return (
        //         <div
        //             style={{
        //                 background: '#ffffff',
        //                 borderRadius: '29px',
        //                 padding: '1.5rem',
        //                 boxShadow: '0px 0px 3px 0px',
        //                 marginBottom: '1rem'
        //             }}
        //             hidden={sessionState == 0}>
        //             <h3>Result</h3>
        //             {ele}

        //         </div>
        //     );
    }


    function Examples() {
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
            );
        }
        return (
            <div>
                {renderElement}
            </div>
        );
    }

    return (
        // TODO: Elements have to be convert to react-bootstrap components
        <>
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
                <Examples />
                {/* <div
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
                        <button style={{ marginTop: '0.5rem', borderStyle: 'none' }} className="btn btn-primary bg-primary" onClick={submit} hidden={true}><i className="bi bi-play-fill"></i> Test</button> 
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
                </div> */}

                {/* <div style={{
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
                                        }} defaultValue={""} /> 
                                    </div>
                                    <div className="col-md-6">
                                        <textarea style={{ height: '6rem', resize: 'none', width: '20rem' }}
                                            defaultValue={""} /> 
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
                        <Tab eventKey="whatever" title="+">
                            not done yet
                        </Tab>
                    </Tabs>
                </div>
                <ResultBlock />  */}
            </div>
            <AlertMessage show={alertStatus} text={alert_text} varient={alert_variant} />
        </>
    );
}