export interface IProblemListItem {
    id: string;
    title: string;
    accepted: number;
    submissions: number;
    challenged: number;
    difficulty: number;
    tags: string[];
}

export interface IProblem {
    id: string;
    title: string;
    details: string;
    difficulty: number;
    tags: string[];
    samples: { input: string, output: string }[];
    accepted: number;
    submissions: number;
}