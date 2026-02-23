import type { QuestionType } from "~/lib/feature/form/form.utils";
import { FormProvider, useForm } from "./formContext";
import QuestionContainer from "./questionContainer";
import { Button } from "@mantine/core";

interface Props {
  questions: QuestionType[];
  initialValues: Record<string, string | number>;
}

const FormContainer = ({ questions, initialValues }: Props) => {
  const form = useForm({
    initialValues,
  });

  const submit = (values: Record<string, string | number>) => {
    console.log({ values });
  };
  return (
    <FormProvider form={form}>
      <form
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
};

export default FormContainer;
