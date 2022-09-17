import fs from 'fs';

import { ITemtemGDoc, ITemtemTrade } from './model';
import { stripParenthesisContent } from './utils';

export function writeOutputCollection(ownedList: ITemtemGDoc[], missingList: ITemtemGDoc[]) {
    let output = 'OWNED:\n```\n';
    output += `TEMTEM (MINT/DAMAGED)\n`;
    ownedList.forEach((owned) => {
        output += `${stripParenthesisContent(owned.temtem)} (${owned.nbMint}/${owned.nbDamaged})\n`;
    });

    output += '```\n\nMISSING:\n```\n';
    output += `TEMTEM (DAMAGED)\n`;
    missingList.forEach((missing) => {
        output += `${stripParenthesisContent(missing.temtem)} (${missing.nbDamaged})\n`;
    });
    output += '```';

    fs.writeFileSync('./outputCollection.txt', output);
}

export function writeOutputTrade(youLookFor: ITemtemTrade[], iLookFor: ITemtemTrade[]) {
    let output = 'You look for:\n```\n';
    output += `TYPE (MINT/DAMAGED) TEMTEM\n`;
    youLookFor.forEach((you) => {
        output += `${you.type.padEnd(7, ' ')} ${`(${you.nbMint}/${you.nbDamaged})`.padEnd(5, ' ')} ${stripParenthesisContent(you.temtem)}\n`;
    });

    output += '```\n\nI look for:\n```\n';
    output += `TYPE (DAMAGED) TEMTEM\n`;
    iLookFor.forEach((i) => {
        output += `${i.type.padEnd(7, ' ')} ${`(${i.nbDamaged})`.padEnd(3, ' ')} ${stripParenthesisContent(i.temtem)}\n`;
    });
    output += '```';

    fs.writeFileSync('./outputTrade.txt', output);
}
