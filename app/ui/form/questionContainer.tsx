import type { QuestionType } from "~/lib/feature/form/form.utils";
import QuestionMapper from "~/lib/feature/form/questionMapper";
import { useFormContext } from "./formContext";

const QuestionContainer = ({ question }: { question: QuestionType }) => {
  const { subQuestions, ...mainQuestion } = question;
  const form = useFormContext();

  return (
    <div className="border border-green-900 rounded-l p-3 flex flex-col bg-white">
      <QuestionMapper
        {...form.getInputProps(mainQuestion.id)}
        question={mainQuestion}
      />
      {subQuestions && (
        <div className="pl-2 pt-2 flex flex-col gap-2 ">
          {subQuestions.map((sq) => {
            return <QuestionContainer question={sq} />;
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionContainer;
