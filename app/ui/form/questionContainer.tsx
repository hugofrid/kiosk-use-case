import { memo } from "react";
import {
  isTableQuestionType,
  type QuestionType,
} from "~/lib/feature/form/form.utils";
import QuestionMapper from "~/lib/feature/form/questionMapper";
import { useFormContext } from "./formContext";

const QuestionContainer = memo(({ question }: { question: QuestionType }) => {
  const { ...mainQuestion } = question;
  const { getInputProps } = useFormContext();

  return (
    <div className="border border-green-900 rounded-l p-3 flex flex-col bg-white">
      <QuestionMapper
        {...getInputProps(mainQuestion.id)}
        question={mainQuestion}
      />
      {question.subQuestions && !isTableQuestionType(question) && (
        <div className="pl-2 pt-2 flex flex-col gap-2 ">
          {question.subQuestions.map((sq) => {
            return <QuestionContainer key={sq.id} question={sq} />;
          })}
        </div>
      )}
    </div>
  );
});

export default QuestionContainer;
