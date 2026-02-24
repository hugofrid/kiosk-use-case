import type {
  FormAnswersType,
  QuestionType,
} from "~/lib/feature/form/form.utils";
import { FormProvider, useForm } from "./formContext";
import QuestionContainer from "./questionContainer";
import { Button } from "@mantine/core";
import { useFormStore } from "~/lib/store/form.store";
import { memo, useCallback, useMemo } from "react";
import { useDebouncedCallback } from "@mantine/hooks";

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

  const submit = (values: FormAnswersType) => {
    console.log({ values });
    clear();
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
        className="w-full flex flex-col p-3  gap-3 bg)"
      >
        {questions.map((q) => (
          <QuestionContainer key={q.id} question={q} />
        ))}
        <Button type="submit">generer le rapport</Button>
      </form>
    </FormProvider>
  );
});

export default FormContainer;
