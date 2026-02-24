import { ActionIcon, Button, TextInput } from "@mantine/core";
import type {
  QuestionTypeTable,
  QuestionType,
} from "~/lib/feature/form/form.utils";
import QuestionMapper from "~/lib/feature/form/questionMapper";
import { useFormContext } from "./formContext";
import { memo, useMemo } from "react";

type Row = Record<string, string | number>;

const emptyRow = (subQuestions: QuestionType[]): Row =>
  Object.fromEntries(subQuestions.map((sq) => [sq.id, ""]));

const SubQuestionsContainer = memo(
  ({ question }: { question: QuestionTypeTable }) => {
    const { getValues, getInputProps, removeListItem, insertListItem } =
      useFormContext();

    const rows: Row[] = useMemo(
      () => (getValues()[question.id] as Row[]) ?? [],
      [question.id],
    );
    return (
      <div className="flex flex-col gap-2 pl-2 pt-2">
        {rows.map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-row gap-2 items-stretch border border-gray-200 rounded p-2"
          >
            <div>
              <TextInput
                label="Libellé"
                description="Label"
                className="flex flex-col h-full"
                descriptionProps={{ className: "!mb-auto" }}
                placeholder="Libellé"
                {...getInputProps(`${question.id}.${rowIndex}._label`)}
              />
            </div>
            {question.subQuestions?.map((sq) => (
              <div key={sq.id} className="flex-1">
                <QuestionMapper
                  {...getInputProps(`${question.id}.${rowIndex}.${sq.id}`)}
                  question={sq}
                />
              </div>
            ))}
            <ActionIcon
              color="red"
              variant="subtle"
              disabled={rows.length <= 1}
              onClick={() => removeListItem(question.id, rowIndex)}
            >
              X
            </ActionIcon>
          </div>
        ))}
        <Button
          variant="light"
          size="xs"
          onClick={() =>
            insertListItem(question.id, emptyRow(question.subQuestions || []))
          }
          className="self-start"
        >
          + Ajouter une ligne
        </Button>
      </div>
    );
  },
);

export default SubQuestionsContainer;
