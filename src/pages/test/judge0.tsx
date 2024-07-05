import axios from 'axios';

export default function Judge0() {

}

function submit_judge(id: number, lang: number, code: string){
    /* 45510 this is sth copilot wrote
    fetch(`https://judge0-ce.p.rapidapi.com/submissions/${id}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "SIGN-UP-FOR-KEY"
        }
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => {
        console.error(err);
    });
    */
    from mongodb get:
    [{
        stdin = "",
        stdout = "",
        cpu_time_limit = 1,

    }]

    // postMessage("http://localhost:2358/submissions/?wait=false", attr={})
    const car: { type: string, model: string, year: number } = {
        type: "Toyota",
        model: "Corolla",
        year: 2009
    };
    let data: any = {
        "submissions": [
            {
                "language_id": 71,
                "source_code": "print(\"hello\")",
                "expected_output": "hello\n\n"
            }
        ]
    };

    axios.post("http://localhost:2358/submissions/batch?wait=false",)
    
    
    Judge0.submissions.batch(~~~)
    save tokens
    
}
