// Imported function from https://github.com/La-Societe-Nouvelle/LaSocieteNouvelle-METRIZ-WebApp/blob/5429f13e940e11bf6658d04993008f24026a1e26/src/components/sections/statements/modals/AssessmentDSN/DSNReader.js
// with typescript integration

// La Société Nouvelle - METRIZ

/* -------------------------------------------------------------------------------------------- */
/* ---------------------------------------- DSN READER ---------------------------------------- */
/* -------------------------------------------------------------------------------------------- */

type DataDSNRow = {
  blocCode: string;
  rubriqueCode: string;
  valueCode: string;
  value: string;
};

type DataDSN = {
  rows: DataDSNRow[];
  errors: string[];
};

type Activite = {
  type: string;
  mesure: string;
  unite: string;
};

type Remuneration = {
  dateDebut: string;
  dateFin: string;
  numeroContrat: string;
  type: string;
  nombreHeures: string;
  montant: string;
  activites: Activite[];
};

type Prime = {
  type: string;
  montant: string;
};

type RevenuAutre = {
  type: string;
  montant: string;
};

type Versement = {
  date: string;
  remunerations: Remuneration[];
  primes: Prime[];
  revenuAutres: RevenuAutre[];
};

type Contrat = {
  dateDebut: string;
  statutConventionnel: string;
  pcsEse: string;
  complementPcsEse: string;
  nature: string;
  dispositifPolitique: string;
  numero: string;
  uniteMesure: string;
  quotiteCategorie: string;
  quotite: string;
  modaliteTemps: string;
};

type Individu = {
  identifiant: string;
  nomFamille: string;
  nomUsage: string;
  prenoms: string;
  sexe: string;
  identifiantTechnique: string;
  contrats: Contrat[];
  versements: Versement[];
};

type Etablissement = {
  nic?: string;
  individus: Individu[];
};

type Entreprise = {
  siren: string;
  nic?: string;
  etablissement: Etablissement;
};

export type DeclarationBloc = {
  nature?: string;
  type?: string;
  fraction?: string;
  ordre?: string;
  mois?: string;
  dateFichier?: string;
  champ?: string;
  devise?: string;
  entreprise: Entreprise;
  errors: string[];
  validStatement: boolean;
};

/* ----------------------------------------------------- */
/* -------------------- FILE READER -------------------- */
/* ----------------------------------------------------- */

export const DSNFileReader = (content: string): DataDSN => {
  // Segmentation des lignes
  const rows = content.replaceAll("\r", "").split("\n");

  const dataDSN: DataDSN = {
    rows: [],
    errors: [],
  };

  // Lecture des lignes
  for (const row of rows) {
    if (/^S[0-9]{2}\.G[0-9]{2}\.[0-9]{2}\.[0-9]{3},'.*'/.test(row)) {
      // ex. S20.G00.05.002,'01'
      const blocCode = row.substring(0, 10);
      const rubriqueCode = row.substring(0, 14);
      const valueCode = row.substring(11, 14);
      const value = row.substring(16, row.length - 1);

      dataDSN.rows.push({ blocCode, rubriqueCode, valueCode, value });
    }
  }

  return dataDSN;
};

/* ----------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------- DATA READER -------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------- */

export const DSNDataReader = (dataDSN: DataDSN): DeclarationBloc => {
  const declaration: Partial<DeclarationBloc> & { entreprise?: Entreprise } =
    {};
  const errors: string[] = [];

  const rows = dataDSN.rows;

  let index = 0;
  while (index < rows.length) {
    const row = rows[index];
    const blocCode = row.blocCode;
    let valueCode = row.valueCode;

    // Déclaration -------------------------------------- //
    if (blocCode === "S20.G00.05") {
      const bloc = getBloc(rows, index, blocCode);
      declaration.nature = bloc["S20.G00.05.001"];
      declaration.type = bloc["S20.G00.05.002"];
      declaration.fraction = bloc["S20.G00.05.003"];
      declaration.ordre = bloc["S20.G00.05.004"];
      declaration.mois = bloc["S20.G00.05.005"];
      declaration.dateFichier = bloc["S20.G00.05.007"];
      declaration.champ = bloc["S20.G00.05.008"];
      declaration.devise = bloc["S20.G00.05.010"];
    }

    // Entreprise --------------------------------------- //
    else if (blocCode === "S21.G00.06") {
      const bloc = getBloc(rows, index, blocCode);
      declaration.entreprise = {
        siren: bloc["S21.G00.06.001"],
        nic: bloc["S21.G00.06.002"],
        etablissement: { individus: [] },
      };
    }

    // Etablissement ------------------------------------ //
    else if (blocCode === "S21.G00.11") {
      const bloc = getBloc(rows, index, blocCode);
      if (declaration.entreprise) {
        declaration.entreprise.etablissement = {
          nic: bloc["S21.G00.11.001"],
          individus: [],
        };
      }
    }

    // Individu ----------------------------------------- //
    else if (blocCode === "S21.G00.30") {
      const bloc = getBloc(rows, index, blocCode);
      const individu: Individu = {
        identifiant: bloc["S21.G00.30.001"],
        nomFamille: bloc["S21.G00.30.002"],
        nomUsage: bloc["S21.G00.30.003"],
        prenoms: bloc["S21.G00.30.004"],
        sexe: bloc["S21.G00.30.005"],
        identifiantTechnique: bloc["S21.G00.30.020"],
        contrats: [],
        versements: [],
      };
      declaration.entreprise?.etablissement.individus.push(individu);
    }

    // Contrat ------------------------------------------ //
    else if (blocCode === "S21.G00.40") {
      const bloc = getBloc(rows, index, blocCode);
      const contrat: Contrat = {
        dateDebut: bloc["S21.G00.40.001"],
        statutConventionnel: bloc["S21.G00.40.002"],
        pcsEse: bloc["S21.G00.40.004"],
        complementPcsEse: bloc["S21.G00.40.005"],
        nature: bloc["S21.G00.40.007"],
        dispositifPolitique: bloc["S21.G00.40.008"],
        numero: bloc["S21.G00.40.009"],
        uniteMesure: bloc["S21.G00.40.011"],
        quotiteCategorie: bloc["S21.G00.40.012"],
        quotite: bloc["S21.G00.40.013"],
        modaliteTemps: bloc["S21.G00.40.014"],
      };
      const individu = getLastItem(
        declaration.entreprise?.etablissement.individus,
      );
      individu?.contrats.push(contrat);
    }

    // Versement ---------------------------------------- //
    else if (blocCode === "S21.G00.50") {
      const bloc = getBloc(rows, index, blocCode);
      const versement: Versement = {
        date: bloc["S21.G00.50.001"],
        remunerations: [],
        primes: [],
        revenuAutres: [],
      };
      const individu = getLastItem(
        declaration.entreprise?.etablissement.individus,
      );
      individu?.versements.push(versement);
    }

    // Remuneration ------------------------------------- //
    else if (blocCode === "S21.G00.51") {
      const bloc = getBloc(rows, index, blocCode);
      const remuneration: Remuneration = {
        dateDebut: bloc["S21.G00.51.001"],
        dateFin: bloc["S21.G00.51.002"],
        numeroContrat: bloc["S21.G00.51.010"],
        type: bloc["S21.G00.51.011"],
        nombreHeures: bloc["S21.G00.51.012"],
        montant: bloc["S21.G00.51.013"],
        activites: [],
      };
      const individu = getLastItem(
        declaration.entreprise?.etablissement.individus,
      );
      const versement = getLastItem(individu?.versements);
      versement?.remunerations.push(remuneration);
    }

    // Activite ----------------------------------------- //
    else if (blocCode === "S21.G00.53") {
      const bloc = getBloc(rows, index, blocCode);
      const activite: Activite = {
        type: bloc["S21.G00.53.001"],
        mesure: bloc["S21.G00.53.002"],
        unite: bloc["S21.G00.53.003"],
      };
      const individu = getLastItem(
        declaration.entreprise?.etablissement.individus,
      );
      const versement = getLastItem(individu?.versements);
      const remuneration = getLastItem(versement?.remunerations);
      remuneration?.activites.push(activite);
    }

    // Prime -------------------------------------------- //
    else if (blocCode === "S21.G00.52") {
      const bloc = getBloc(rows, index, blocCode);
      const prime: Prime = {
        type: bloc["S21.G00.52.001"],
        montant: bloc["S21.G00.52.002"],
      };
      const individu = getLastItem(
        declaration.entreprise?.etablissement.individus,
      );
      const versement = getLastItem(individu?.versements);
      versement?.primes.push(prime);
    }

    // Revenu autre ------------------------------------- //
    else if (blocCode === "S21.G00.54") {
      const bloc = getBloc(rows, index, blocCode);
      const revenuAutre: RevenuAutre = {
        type: bloc["S21.G00.54.001"],
        montant: bloc["S21.G00.54.002"],
      };
      const individu = getLastItem(
        declaration.entreprise?.etablissement.individus,
      );
      const versement = getLastItem(individu?.versements);
      versement?.revenuAutres.push(revenuAutre);
    }

    // Avance de l'index -------------------------------- //
    while (
      index < rows.length &&
      rows[index].blocCode === blocCode &&
      parseInt(rows[index].valueCode) >= parseInt(valueCode)
    ) {
      valueCode = rows[index].valueCode;
      index += 1;
    }
  }

  return {
    ...declaration,
    entreprise: declaration.entreprise!,
    errors,
    validStatement: errors.length === 0,
  };
};

/* ----------------------------------------------------------------------------------------------------------------- */
/* --------------------------------------------------- HELPERS ---------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------------- */

const getLastItem = <T>(array: T[] | undefined): T | undefined => {
  if (!array || array.length === 0) return undefined;
  return array[array.length - 1];
};

const getBloc = (
  rows: DataDSNRow[],
  index: number,
  blocCode: string,
): Record<string, string> => {
  const bloc: Record<string, string> = {};
  let valueCode = rows[index].valueCode;
  while (
    index < rows.length &&
    rows[index].blocCode === blocCode &&
    parseInt(rows[index].valueCode) >= parseInt(valueCode)
  ) {
    const row = rows[index];
    bloc[row.rubriqueCode] = row.value;
    valueCode = row.valueCode;
    index += 1;
  }
  return bloc;
};
