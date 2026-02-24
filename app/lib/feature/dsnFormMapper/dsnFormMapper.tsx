import type { DeclarationBloc, Individu } from "../dsn/dsn.utils";
import type {
  QuestionTypeNumber,
  QuestionTypeTable,
  QuestionTypeText,
} from "../form/form.utils";
import { v4 as uuidv4 } from "uuid";

type MappedResponseType =
  | { type: QuestionTypeNumber["type"]; value: number }
  | { type: QuestionTypeText["type"]; value: string }
  | {
      type: QuestionTypeTable["type"];
      value: Record<string, string | number>[];
    };

type DsnMappingSource = {
  getValue: (d: DeclarationBloc) => MappedResponseType;
};

type DsnFormMappingConf = Record<string, DsnMappingSource>;

export const dsnFormMapper: DsnFormMappingConf = {
  "S1-6_01": {
    getValue: (d) => {
      const individus = d.entreprise.etablissement.individus;

      return {
        type: "TABLE",
        value: [
          {
            _id: uuidv4(),
            "S1-6_02": individus.length,
          },
        ],
      };
    },
  },
  "S1-6_04": {
    getValue: (d) => {
      const byCountry = d.entreprise.etablissement.individus.reduce(
        (acc: Record<string, Individu[]>, individu) => {
          const key = individu.codePays;
          acc[key] = [...(acc[key] ?? []), individu];
          return acc;
        },
        {},
      );

      return {
        type: "TABLE",
        value: Object.entries(byCountry).map(([key, individus]) => ({
          _id: uuidv4(),
          _label: key,
          "S1-6_05": individus.length,
        })),
      };
    },
  },
  "S1-6_08": {
    getValue: (d) => {
      const byRegion = d.entreprise.etablissement.individus.reduce(
        (acc: Record<string, Individu[]>, individu) => {
          const key = individu.localite;
          acc[key] = [...(acc[key] ?? []), individu];
          return acc;
        },
        {},
      );

      return {
        type: "TABLE",
        value: Object.entries(byRegion).map(([key, individus]) => ({
          _id: uuidv4(),
          _label: key,
          "S1-6_09": individus.length,
        })),
      };
    },
  },
  "S1-6_07": {
    getValue: (d) => {
      const byContractAndGender = d.entreprise.etablissement.individus.reduce(
        (acc: Record<string, Individu[]>, individu) => {
          const contratType = individu.contrats[0]?.statutConventionnel;
          const key = `${contratType}_${individu.sexe === "01" ? "homme" : "femme"}`;
          acc[key] = [...(acc[key] ?? []), individu];
          return acc;
        },
        {},
      );

      return {
        type: "TABLE",
        value: Object.entries(byContractAndGender).map(([key, individus]) => ({
          _id: uuidv4(),
          _label: key,
          K_718: individus.length,
        })),
      };
    },
  },
  "S1-6_18": {
    getValue: (d) => {
      const byCategory = d.entreprise.etablissement.individus.reduce(
        (acc: Record<string, Individu[]>, individu) => {
          const contratType = individu.contrats[0].pcsEse;
          const key = `${contratType}_${individu.sexe}`;
          acc[key] = [...(acc[key] ?? []), individu];
          return acc;
        },
        {},
      );

      return {
        type: "TABLE",
        value: Object.entries(byCategory).map(([key, individus]) => ({
          _id: uuidv4(),
          _label: key,
          "S1-6_19": individus.length,
        })),
      };
    },
  },
};
