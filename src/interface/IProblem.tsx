export interface IProblemListItem {
    id: string;
    title: string;
    difficulty: number;
    tags: string[];
    accessed: number;
    challenged: number;
}

export interface Problem {
    id: number;
    title: string;
    description: string;
    inputDescription: string;
    outputDescription: string;
    samples?: any[];
    timeLimit: number;
    memoryLimit: number;
    createdAt: Date;
    tags: string[];
    updatedAt?: Date;
    difficulty: number;
    records: {
        accepted: number;
        submissions: number;
    }
}