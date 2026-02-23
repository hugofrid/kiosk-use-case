//mapping configuration

import type { DeclarationBloc } from "../dsn/dsn.utils";
import type { QuestionTypeNumber, QuestionTypeText } from "../form/form.utils";

type MappedResponseType =
  | {
      type: QuestionTypeNumber["type"];
      value: number;
    }
  | {
      type: QuestionTypeText["type"];
      value: string;
    };

type DsnMappingSource = {
  getValue: (d: DeclarationBloc) => MappedResponseType;
};

//the key is the question Id
type DsnFormMappingConf = Record<string, DsnMappingSource>;

export const dsnFormMapper: DsnFormMappingConf = {
  //Global employees - Number of employees (end of period)
  "S1-6_02": {
    getValue: (d) => ({
      type: "NUMBER",
      value: d.entreprise.etablissement.individus.length,
    }),
  },
  //Global employees - Number of employees (average during period)
  "S1-6_03": {
    getValue: (d) => {
      const individus = d.entreprise.etablissement.individus;
      if (individus.length === 0) return { type: "NUMBER", value: 0 };
      const total = individus.reduce((acc, i) => acc + i.versements.length, 0);
      return { type: "NUMBER", value: Math.round(total / individus.length) };
    },
  },
};
