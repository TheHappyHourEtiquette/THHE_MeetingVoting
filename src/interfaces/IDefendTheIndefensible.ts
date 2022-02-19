import { IPanellistScore } from "./IPanellistScore";

export interface IDefendTheIndefensible {
    QuestionText: string;
    QuestionOrder: number;
    Scores?: IPanellistScore[];
}
