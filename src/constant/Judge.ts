import { JudgeLanguage } from '@/interface/Judge';

export const Language: { [key: number]: JudgeLanguage; } = {
    // ID: [Compiler, Language],
    1: ["GNU C++17", "cpp"],
    2: ["GNU C++14", "cpp"],
    3: ["Python 3", "python"],
    4: ["Node.js", "javascript"],
    5: ["Java", "java"],
};

export const SubmitMethodID = {
    TEXT: 1,
    FILE: 2,
}

