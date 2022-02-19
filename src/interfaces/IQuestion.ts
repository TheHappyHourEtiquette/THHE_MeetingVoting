import { IPanellistScore } from "./IPanellistScore";

export interface IQuestion {
    QuestionText: string;
    QuestionOrder: number;
    Scores: IPanellistScore[];
}
