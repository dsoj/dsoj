import { ReactElement } from "react";
import { Button } from "react-bootstrap";

export function SubmissionStatusElement({ status }: { status: number; }): ReactElement {
    switch (status) {
        case 0:
            return (
                <span style={{ color: 'rgb(229, 4, 59)', fontWeight: 'bold' }}>TLE</span>
            );
        case 1:
            return (
                <span style={{ color: 'rgb(49,50,57)', fontWeight: 'bold' }}>N/A</span>
            );
        case 2:
            return (
                <span style={{ color: 'rgb(0,135,114)', fontWeight: 'bold' }}>AC</span>
            );
    }
    return <span></span>;
}

export function difficulty_text(difficulty: number): string {
    switch (difficulty) {
        case 0:
            return "Easy";
        case 1:
            return "Medium";
        case 2:
            return "Hard";
    }
    return "";
}

export function DifficultyElement(props: { difficulty: number; }) {
    return (
        <button className="btn btn-warning" type="button" disabled style={{ height: "1.5rem", padding: 0, fontSize: "0.8rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", marginRight: "0.3rem", borderStyle: "none", borderTopStyle: "none" }}>
            {difficulty_text(props.difficulty)}
        </button>
    );
}

export function TagElement(tag: string) {
    return (
        <Button className="btn btn-primary" type="button" href={`/tags/${tag}`} style={{ height: "1.5rem", paddingTop: "0.1rem", fontSize: "0.8rem", paddingLeft: "0.5rem", paddingRight: "0.5rem", marginRight: "0.3rem", background: "rgb(190,190,190)", borderStyle: "none" }}>
            #{tag}
        </Button>
    );
}