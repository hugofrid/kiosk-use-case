import { ActionIcon, Button, TextInput } from "@mantine/core";
import type {
  QuestionType,
  QuestionTypeTable,
} from "~/lib/feature/form/form.utils";
import QuestionMapper from "~/lib/feature/form/questionMapper";
import { useFormContext } from "./formContext";
import { v4 as uuidv4 } from "uuid";

type Row = Record<string, string | number>;

const emptyRow = (subQuestions: QuestionType[]): Row =>
  Object.fromEntries([
    ["_id", uuidv4()],
    ...subQuestions.map((sq) => [sq.id, ""]),
  ]);

const SubQuestionsContainer = ({
  question,
}: {
  question: QuestionTypeTable;
}) => {
  const form = useFormContext();

  const rows: Row[] = (form.values[question.id] as Row[]) ?? [];
  return (
    <div className="flex flex-col gap-2 pl-2 pt-2">
      {rows.map(({ _id }, rowIndex) => (
        <div
          key={`${question.id}_${_id}`}
          className="flex flex-row gap-2 items-stretch border border-gray-200 rounded p-2"
        >
          <div>
            <TextInput
              label="Libellé"
              description="Label"
              className="flex flex-col h-full"
              descriptionProps={{ className: "!mb-auto" }}
              placeholder="Libellé"
              {...form.getInputProps(`${question.id}.${rowIndex}._label`)}
            />
          </div>
          {question.subQuestions?.map((sq) => (
            <div key={sq.id} className="flex-1">
              <QuestionMapper
                {...form.getInputProps(`${question.id}.${rowIndex}.${sq.id}`)}
                question={sq}
              />
            </div>
          ))}
          <ActionIcon
            color="red"
            variant="subtle"
            disabled={rows.length <= 1}
            onClick={() => form.removeListItem(question.id, rowIndex)}
          >
            X
          </ActionIcon>
        </div>
      ))}
      <Button
        variant="light"
        size="xs"
        onClick={() =>
          form.insertListItem(
            question.id,
            emptyRow(question.subQuestions || []),
          )
        }
        className="self-start"
      >
        + Ajouter une ligne
      </Button>
    </div>
  );
};

export default SubQuestionsContainer;
