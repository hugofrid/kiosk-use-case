import { Container, Loader } from "@mantine/core";
import fs from "fs";
import path from "path";
import { dsnFormMapper } from "~/lib/feature/dsnFormMapper/dsnFormMapper";
import {
  isTableQuestionType,
  mapRowsToQuestions,
  type FormAnswersType,
  type QuestionType,
} from "~/lib/feature/form/form.utils";
import { parseQuestionCSV } from "~/lib/feature/form/question.utils";
import FormContainer from "~/ui/form/formContainer";
import { DSNDataReader, DSNFileReader } from "../lib/feature/dsn/dsn.utils";
import type { Route } from "./+types/_index";
import { useFormStore } from "~/lib/store/form.store";
import { useMemo } from "react";

export async function loader() {
  const dsnFilePath = path.resolve("app/lib/sample/dsn.txt");
  const dsnFile = fs.readFileSync(dsnFilePath, "utf-8");
  const questionFilePath = path.resolve("app/lib/sample/question.csv");
  const questionFile = fs.readFileSync(questionFilePath, "utf-8");
  const questionCsv = parseQuestionCSV(questionFile);
  const questions = mapRowsToQuestions(questionCsv);
  const dsnPardedContent = await DSNFileReader(dsnFile);
  const declaration = await DSNDataReader(dsnPardedContent);
  return { declaration, questions };
}

const Index = ({ loaderData }: Route.ComponentProps) => {
  const { declaration, questions } = loaderData;

  const initialValues = useMemo(
    () =>
      questions.reduce((acc: FormAnswersType, curr) => {
        const getInitialAnswer = (q: QuestionType) => {
          if (q.id in dsnFormMapper) {
            const answer = dsnFormMapper[q.id].getValue(declaration);
            if (answer) {
              acc[`${q.id}`] = answer.value;
            } else if (isTableQuestionType(q)) {
              acc[`${q.id}`] = [];
            }
          }
        };
        getInitialAnswer(curr);
        if (isTableQuestionType(curr) && curr.subQuestions) {
          curr.subQuestions.forEach((sq) => {
            getInitialAnswer(sq);
          });
        }
        return acc;
      }, {}),
    [],
  );
  const { values: storedValues, _hydrated } = useFormStore();
  const hasStoredValues = useMemo(
    () => Object.keys(storedValues).length > 0,
    [storedValues],
  );
  return !_hydrated ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader />
    </div>
  ) : (
    <FormContainer
      questions={questions}
      initialValues={hasStoredValues ? storedValues : initialValues}
    />
  );
};

export default Index;
