import type {
  FormAnswersType,
  QuestionType,
} from "~/lib/feature/form/form.utils";
import { FormProvider, useForm } from "./formContext";
import QuestionContainer from "./questionContainer";
import { Button, Container } from "@mantine/core";
import { useFormStore } from "~/lib/store/form.store";
import { memo, useCallback, useMemo } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { exportToDocx } from "~/lib/feature/docx/exporter";

interface Props {
  questions: QuestionType[];
  initialValues: FormAnswersType;
}

const FormContainer = memo(({ questions, initialValues }: Props) => {
  const { setValues, clear } = useFormStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
  });

  const submit = async (values: FormAnswersType) => {
    await exportToDocx(questions, values, "rapport.docx");
    clear();
    form.reset();
  };

  const debouncedSync = useDebouncedCallback(
    () => setValues(form.getValues()),
    300, // ms
  );
  return (
    <FormProvider form={form}>
      <form
        onChange={debouncedSync}
        onSubmit={form.onSubmit(submit)}
        className="w-full flex flex-col overflow-hidden flex-1  "
      >
        <Container className="flex-1 flex flex-col max-h-full  overflow-auto p-3 gap-3">
          {questions.map((q) => (
            <QuestionContainer key={q.id} question={q} />
          ))}
        </Container>

        <div className="p-2 flex items-center justify-center w-full">
          <Button type="submit">generer le rapport</Button>
        </div>
      </form>
    </FormProvider>
  );
});

export default FormContainer;
