import { createFormContext } from "@mantine/form";
import type { FormAnswersType } from "~/lib/feature/form/form.utils";

export const [FormProvider, useFormContext, useForm] =
  createFormContext<FormAnswersType>();
