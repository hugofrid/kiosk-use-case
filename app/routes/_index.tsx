import { Container } from "@mantine/core";
import fs from "fs";
import path from "path";
import { dsnFormMapper } from "~/lib/feature/dsnFormMapper/dsnFormMapper";
import {
  mapRowsToQuestions,
  type QuestionType,
} from "~/lib/feature/form/form.utils";
import { parseQuestionCSV } from "~/lib/feature/form/question.utils";
import FormContainer from "~/ui/form/formContainer";
import { DSNDataReader, DSNFileReader } from "../lib/feature/dsn/dsn.utils";
import type { Route } from "./+types/_index";

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

const Layout = ({ loaderData }: Route.ComponentProps) => {
  const { declaration, questions } = loaderData;
  const initialValues = questions.reduce(
    (acc: Record<string, string | number>, curr) => {
      const getInitialAnswer = (q: QuestionType) => {
        if (q.id in dsnFormMapper) {
          const answer = dsnFormMapper[q.id].getValue(declaration).value;
          if (answer) {
            acc[`${q.id}`] = answer;
          }
        }
      };
      getInitialAnswer(curr);
      if (curr.subQuestions) {
        curr.subQuestions.forEach((sq) => {
          getInitialAnswer(sq);
        });
      }
      return acc;
    },
    {},
  );
  return (
    <Container>
      <FormContainer questions={questions} initialValues={initialValues} />
    </Container>
  );
};

export default Layout;
