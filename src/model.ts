export interface ITemtemGDoc {
    temtem: string;
    nbMint: number;
    nbDamaged: number;
}

export interface ITemtemTrade {
    temtem: string;
    type: 'mint' | 'damaged';
    nbMint?: number;
    nbDamaged: number;
}
