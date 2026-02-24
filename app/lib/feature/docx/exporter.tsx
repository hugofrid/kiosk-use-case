// ~/lib/feature/form/docxExporter.ts
import {
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import fileSaver from "file-saver";
import {
  type FormAnswersType,
  isTableQuestionType,
  isTitleQuestionType,
  type QuestionType,
  type QuestionTypeTable,
} from "../form/form.utils";

type Row = Record<string, string | number>;

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const buildTableSection = (question: QuestionTypeTable, rows: Row[]) => {
  const subQuestions = question.subQuestions ?? [];
  const colCount = subQuestions.length + 1; // +1 pour _label
  const tableWidth = 9026; // A4 avec 1" margins
  const colWidth = Math.floor(tableWidth / colCount);

  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun(question.labelFr)],
    }),
    new Table({
      width: { size: tableWidth, type: WidthType.DXA },
      columnWidths: Array(colCount).fill(colWidth),
      rows: [
        // Header row
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              borders,
              width: { size: colWidth, type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: "Libellé", bold: true })],
                }),
              ],
            }),
            ...subQuestions.map(
              (sq) =>
                new TableCell({
                  borders,
                  width: { size: colWidth, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: sq.labelFr, bold: true })],
                    }),
                  ],
                }),
            ),
          ],
        }),
        // Data rows
        ...rows.map(
          (row) =>
            new TableRow({
              children: [
                new TableCell({
                  borders,
                  width: { size: colWidth, type: WidthType.DXA },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      children: [new TextRun(String(row._label ?? ""))],
                    }),
                  ],
                }),
                ...subQuestions.map(
                  (sq) =>
                    new TableCell({
                      borders,
                      width: { size: colWidth, type: WidthType.DXA },
                      margins: { top: 80, bottom: 80, left: 120, right: 120 },
                      children: [
                        new Paragraph({
                          children: [new TextRun(String(row[sq.id] ?? ""))],
                        }),
                      ],
                    }),
                ),
              ],
            }),
        ),
      ],
    }),
    new Paragraph({ children: [] }), // espacement après table
  ];
};

export const exportToDocx = async (
  questions: QuestionType[],
  answers: FormAnswersType,
  filename = "rapport.docx",
) => {
  const children = questions.flatMap((q) => {
    if (isTableQuestionType(q)) {
      const rows = (answers[q.id] as Row[]) ?? [];
      return buildTableSection(q, rows);
    }

    if (isTitleQuestionType(q)) {
      const titleChildren: (Paragraph | Table)[] = [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun(q.labelFr)],
        }),
      ];
      // Les subQuestions d'un TITLE sont des champs plats
      (q.subQuestions ?? []).forEach((sq) => {
        const value = answers[sq.id];
        if (value !== undefined && value !== "") {
          titleChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${sq.labelFr} : `, bold: true }),
                new TextRun(String(value)),
              ],
            }),
          );
        }
      });
      return titleChildren;
    }

    // Champ simple
    const value = answers[q.id];
    if (value === undefined || value === "") return [];
    return [
      new Paragraph({
        children: [
          new TextRun({ text: `${q.labelFr} : `, bold: true }),
          new TextRun(String(value)),
        ],
      }),
    ];
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  fileSaver.saveAs(buffer, filename);
};
