import {
  NumberInput,
  Select,
  TextInput,
  type __BaseInputProps,
} from "@mantine/core";
import SubQuestionsContainer from "~/ui/form/subQuestionsRow";
import {
  isEnumQuestionType,
  isNumberQuestionType,
  isTableQuestionType,
  isTextQuestionType,
  type QuestionType,
} from "./form.utils";
import { memo, useMemo } from "react";

const QuestionMapper = memo(
  ({
    question,
    ...defaultProps
  }: __BaseInputProps & { question: QuestionType }) => {
    const commonProps: __BaseInputProps = useMemo(
      () => ({
        label: question.labelFr,
        description: question.labelEn,
        ...defaultProps,
      }),
      [question],
    );
    if (isTextQuestionType(question)) {
      return (
        <TextInput
          descriptionProps={{ className: "!mb-auto" }}
          {...commonProps}
        />
      );
    }
    if (isEnumQuestionType(question)) {
      return (
        <Select
          {...commonProps}
          className="flex flex-col h-full"
          descriptionProps={{ className: "!mb-auto" }}
          data={[...question.enumFr]}
          renderOption={(option) => {
            const optionIndex = question.enumFr.findIndex(
              (e) => e === option.option.value,
            );
            return (
              <div className="flex flex-col h-full">
                {option.option.label}
                <div className="text-gray-500" lang="en">
                  {question.enumEn[optionIndex]}
                </div>
              </div>
            );
          }}
        />
      );
    }
    if (isNumberQuestionType(question)) {
      const enumLabel = question.unit
        ? `${commonProps.label} (${question.unit})`
        : commonProps.label;
      const enumDescription = question.unit
        ? `${commonProps.description} (${question.unit})`
        : commonProps.description;
      return (
        <NumberInput
          {...commonProps}
          className="flex flex-col  h-full"
          descriptionProps={{ className: "!mb-auto" }}
          label={enumLabel}
          description={enumDescription}
        />
      );
    }
    if (isTableQuestionType(question)) {
      return (
        <div className="flex flex-col h-full">
          {question.labelFr}
          <div className="text-gray-400 text-xs ">{question.labelEn}</div>
          {question.subQuestions && (
            <div className="pl-2 pt-2 flex flex-col gap-2 ">
              <SubQuestionsContainer question={question} />
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full">
        {question.labelFr}
        <div className="text-gray-400 text-xs ">{question.labelEn}</div>
      </div>
    );
  },
);

export default QuestionMapper;
