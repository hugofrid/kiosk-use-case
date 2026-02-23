export type RowQuestion = {
  id: string;
  labelEn: string;
  labelFr: string;
  content: "Table" | "number" | "enum" | "Text";
  relatedQuestionId: string | null;
  order: number | null;
  unit: string | null;
  enum: {
    en: string[];
    fr: string[];
  } | null;
};

export const parseQuestionCSV = (csvContent: string): RowQuestion[] => {
  const lines = csvContent.split("\n").slice(1);

  return lines
    .map((line) => {
      const cols = line.split(";");

      const id = cols[0]?.trim();
      if (!id) return null;

      const enumEn = cols[7]?.trim();
      const enumFr = cols[8]?.trim();

      return {
        id,
        labelEn: cols[1]?.trim() ?? "",
        labelFr: cols[2]?.trim() ?? "",
        content: cols[3]?.trim() as RowQuestion["content"],
        relatedQuestionId: cols[4]?.trim() || null,
        order: cols[5]?.trim() ? parseInt(cols[5]) : null,
        unit: cols[6]?.trim() || null,
        enum:
          enumEn && enumFr
            ? {
                en: enumEn.split(",").map((s) => s.trim()),
                fr: enumFr.split(",").map((s) => s.trim()),
              }
            : null,
      } satisfies RowQuestion;
    })
    .filter((q): q is RowQuestion => q !== null);
};
