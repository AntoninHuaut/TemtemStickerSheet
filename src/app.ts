import CSV from 'csv-string';
import { Comma } from 'csv-string/dist/types.js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

import { ITemtemGDoc, ITemtemTrade } from './model';
import { writeOutputCollection, writeOutputTrade } from './output.js';
import { stripParenthesisContent } from './utils.js';

dotenv.config();

const credentials = JSON.parse(fs.readFileSync('./googlesheet-credentials.json', 'utf-8'));
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
await doc.useServiceAccountAuth(credentials);

await doc.loadInfo();
const sheet = doc.sheetsByIndex[0];
const rows = await sheet.getRows();
const { ownedList, missingList } = analyseRows(rows);
const { youLookFor, iLookFor } = checkInputs(ownedList, missingList);
writeOutputCollection(ownedList, missingList);
writeOutputTrade(youLookFor, iLookFor);

function analyseRows(rows: GoogleSpreadsheetRow[]) {
    const ownedList: ITemtemGDoc[] = [];
    const missingList: ITemtemGDoc[] = [];

    rows.forEach((row) => {
        const rowData = row._rawData;
        const owned = rowData[0] === 'TRUE';
        const temtem = rowData[1];
        const nbMint = +rowData[4];
        const nbDamaged = +rowData[5];
        if (!temtem) return;

        if (owned && (nbMint > 0 || nbDamaged > 0)) {
            ownedList.push({ temtem, nbMint, nbDamaged });
        } else if (!owned) {
            missingList.push({ temtem, nbMint, nbDamaged });
        }
    });

    return { ownedList, missingList };
}

function checkInputs(ownedList: ITemtemGDoc[], missingList: ITemtemGDoc[]) {
    const readAndFormat = (fileName: string) => {
        const txt = fs.readFileSync(`./input/${fileName}.txt`, 'utf8');
        let separator: Comma | RegExp = CSV.detect(txt);
        if (!txt.includes(separator) && /\r|\n/.exec(txt.trim())) {
            separator = /\r|\n/;
        }
        return txt.split(separator).map((str) => stripParenthesisContent(str.toLowerCase().trim()));
    };

    const haveDamaged = readAndFormat('haveDamaged');
    const haveMint = readAndFormat('haveMint');
    const needDamaged = readAndFormat('needDamaged');
    const needMint = readAndFormat('needMint');

    const youLookFor: ITemtemTrade[] = [];
    const iLookFor: ITemtemTrade[] = [];
    ownedList.forEach((owned) => {
        if (!owned.temtem) return;

        const temtem = stripParenthesisContent(owned.temtem.toLowerCase());

        if (needDamaged.includes(temtem) && owned.nbDamaged > 0) {
            youLookFor.push({ temtem, type: 'damaged', nbMint: owned.nbMint, nbDamaged: owned.nbDamaged });
        }
        if (needMint.includes(temtem) && owned.nbMint > 0) {
            youLookFor.push({ temtem, type: 'mint', nbMint: owned.nbMint, nbDamaged: owned.nbDamaged });
        }
    });

    const allowMintIfOwnedDamaged: boolean = process.env.ALLOW_MINT_IF_OWNED_DAMAGED === 'true';
    const allowDamagedIfNotOwnedAny: boolean = process.env.ALLOW_DAMAGED_IF_NOT_OWNED_ANY === 'true';
    missingList.forEach((missing) => {
        if (!missing.temtem) return;

        const temtem = stripParenthesisContent(missing.temtem.toLowerCase());
        if (haveMint.includes(temtem) && (allowMintIfOwnedDamaged || missing.nbDamaged === 0)) {
            iLookFor.push({ temtem, type: 'mint', nbDamaged: missing.nbDamaged });
        }

        if (
            haveDamaged.includes(temtem) &&
            (allowDamagedIfNotOwnedAny || missing.nbDamaged > 0) &&
            iLookFor.filter((row) => row.temtem === temtem).length === 0
        ) {
            iLookFor.push({ temtem, type: 'damaged', nbDamaged: missing.nbDamaged });
        }
    });

    return { youLookFor, iLookFor };
}
