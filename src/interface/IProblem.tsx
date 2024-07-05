export interface IProblemListItem {
    id: string;
    title: string;
    difficulty: number;
    tags: string[];
    accessed: number;
    challenged: number;
}