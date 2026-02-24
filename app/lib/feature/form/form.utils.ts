import type { RowQuestion } from "./question.utils";

export type QuestionBase = {
  id: string;
  labelEn: string;
  labelFr: string;
  order: number;
  subQuestions?: QuestionType[]; // remplace relatedQuestion
};

//question type types
export type QuestionTypeEnum = QuestionBase & {
  type: "ENUM";
  enumFr: string[];
  enumEn: string[];
  answer?: { fr: string; en: string };
};
export type QuestionTypeTitle = QuestionBase & {
  type: "TITLE";
};

export type QuestionTypeText = QuestionBase & {
  type: "TEXT";
  answer?: string;
};
export type QuestionTypeNumber = QuestionBase & {
  type: "NUMBER";
  unit: string;
  answer?: number;
};
export type QuestionTypeTable = QuestionBase & {
  type: "TABLE";
  unit: string;
  answer?: QuestionType[];
};

export type QuestionType =
  | QuestionTypeEnum
  | QuestionTypeText
  | QuestionTypeTable
  | QuestionTypeNumber
  | QuestionTypeTitle;

export type FormAnswersType = Record<
  string,
  string | number | Record<string, string | number>[]
>;
// Guard function
export function isEnumQuestionType(
  question: QuestionType,
): question is QuestionTypeEnum {
  return question.type === "ENUM";
}
export function isTextQuestionType(
  question: QuestionType,
): question is QuestionTypeText {
  return question.type === "TEXT";
}
export function isTableQuestionType(
  question: QuestionType,
): question is QuestionTypeTable {
  return question.type === "TABLE";
}
export function isNumberQuestionType(
  question: QuestionType,
): question is QuestionTypeNumber {
  return question.type === "NUMBER";
}

export function isTitleQuestionType(
  question: QuestionType,
): question is QuestionTypeTitle {
  return question.type === "TITLE";
}

export const mapRowToQuestion = (
  row: RowQuestion,
  subQuestions: QuestionType[],
): QuestionType | null => {
  const base = {
    id: row.id,
    labelEn: row.labelEn,
    labelFr: row.labelFr,
    order: row.order ?? 0,
    subQuestions: subQuestions.length > 0 ? subQuestions : undefined,
  };

  switch (row.content) {
    case "enum":
      if (!row.enum) return null;
      return {
        ...base,
        type: "ENUM",
        enumEn: row.enum.en,
        enumFr: row.enum.fr,
      };

    case "Text":
      return {
        ...base,
        type: "TEXT",
      };

    case "number":
      return {
        ...base,
        type: "NUMBER",
        unit: row.unit ?? "",
      };

    case "Table":
      return {
        ...base,
        type: "TABLE",
        unit: row.unit ?? "",
      };

    default:
      return { ...base, type: "TITLE" };
  }
};

export const mapRowsToQuestions = (
  rows: RowQuestion[],
  isSubquestion?: boolean,
): QuestionType[] =>
  rows.flatMap((row) => {
    if (row.relatedQuestionId !== null && !isSubquestion) {
      return [];
    }
    const subQuestions = rows.filter((e) => e.relatedQuestionId === row.id);
    const question = mapRowToQuestion(
      row,
      mapRowsToQuestions(subQuestions, true),
    );
    return question ? [question] : [];
  });
