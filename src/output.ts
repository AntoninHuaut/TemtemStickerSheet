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
    iLookFor = iLookFor.sort((a, b) => {
        const n = -a.type.localeCompare(b.type);
        if (n !== 0) return n;

        return a.temtem.localeCompare(b.temtem);
    });

    let nbMint = 0;
    let nbDamaged = 0;

    let output = 'You look for:\n```\n';
    output += `TYPE (MINT/DAMAGED) TEMTEM\n`;
    youLookFor.forEach((you) => {
        output += `${you.type.padEnd(7, ' ')} ${`(${you.nbMint}/${you.nbDamaged})`.padEnd(5, ' ')} ${stripParenthesisContent(you.temtem)}\n`;

        if (you.type === 'mint') nbMint++;
        if (you.type === 'damaged') nbDamaged++;
    });
    output += `${'```\n'}${nbMint} mint + ${nbDamaged} damaged = ${nbMint * 2 + nbDamaged} "points"\n`;
    nbMint = 0;
    nbDamaged = 0;

    output += '\n\nI look for:\n```\n';
    output += `TYPE (DAMAGED) TEMTEM\n`;
    iLookFor.forEach((i) => {
        output += `${i.type.padEnd(7, ' ')} ${`(${i.nbDamaged})`.padEnd(3, ' ')} ${stripParenthesisContent(i.temtem)}\n`;

        if (i.type === 'mint') nbMint++;
        if (i.type === 'damaged') nbDamaged++;
    });
    output += `${'```\n'}${nbMint} mint + ${nbDamaged} damaged = ${nbMint * 2 + nbDamaged} "points"\n`;

    fs.writeFileSync('./outputTrade.txt', output);
}
