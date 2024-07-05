export interface ISubmission {
    id: number;
    problemId: number;
    userId: number;
    code: string;
    language: string;
    status: string;
    time: number;
    memory: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISubmitRequest {
    problemId: number;
    code: string;
    language: string;
    userId: number;
}

export interface ILanguageInfo {
    id: number;
    judge0_id: number;
    name: string;
    version: string;
    compile?: string;
    run?: string;
}