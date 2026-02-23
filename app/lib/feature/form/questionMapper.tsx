import {
  NumberInput,
  Select,
  TextInput,
  type __BaseInputProps,
} from "@mantine/core";
import {
  isEnumQuestionType,
  isNumberQuestionType,
  isTableQuestionType,
  isTextQuestionType,
  type QuestionType,
} from "./form.utils";

const QuestionMapper = ({
  question,
  ...defaultProps
}: __BaseInputProps & { question: QuestionType }) => {
  const commonProps: __BaseInputProps = {
    label: question.labelFr,
    description: question.labelEn,
    ...defaultProps,
  };
  if (isTextQuestionType(question)) {
    return <TextInput {...commonProps} />;
  }
  if (isEnumQuestionType(question)) {
    return (
      <Select
        {...commonProps}
        data={[...question.enumFr]}
        renderOption={(option) => {
          const optionIndex = question.enumFr.findIndex(
            (e) => e === option.option.value,
          );
          return (
            <div className="flex">
              {option.option.label}
              <div lang="en">{question.enumEn[optionIndex]}</div>
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
        label={enumLabel}
        description={enumDescription}
      />
    );
  }
  if (isNumberQuestionType(question)) {
    return <NumberInput {...commonProps} />;
  }

  return (
    <div className="flex flex-col">
      {question.labelFr}
      <div className="text-gray-400 text-xs ">{question.labelEn}</div>
    </div>
  );
};

export default QuestionMapper;
