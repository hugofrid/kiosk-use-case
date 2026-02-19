export type QuestionBase = {
  id: string;
  labelEn: string;
  labelFr: string;
  order: number;
  relatedQuestion?: string;
};

//question type types
export type QuestionTypeEnum = QuestionBase & {
  type: "ENUM";
  enumFr: string[];
  enumEn: string[];
  response?: { fr: string; en: string };
};

export type QuestionTypeText = QuestionBase & {
  type: "TEXT";
  response?: string;
};
export type QuestionTypeNumber = QuestionBase & {
  type: "NUMBER";
  unit: string;
  response?: number;
};
export type QuestionTypeTable = QuestionBase & {
  type: "TABLE";
  unit: string;
  response?: QuestionType[];
};

export type QuestionType =
  | QuestionTypeEnum
  | QuestionTypeText
  | QuestionTypeTable
  | QuestionTypeNumber;

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
