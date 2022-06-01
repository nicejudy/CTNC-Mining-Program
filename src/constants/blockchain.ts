export const TOKEN_DECIMALS = 18;

export enum Networks {
    BSC = 56,
    AVALANCHE = 43114,
    FANTOM = 250,
    CRONOS = 25,
    MOONRIVER = 1285
}

export const getMainnetURI = (chainID: number): string => {

    if (chainID == Networks.BSC) {
        return "https://bsc-dataseed.binance.org/";
    } else if(chainID == Networks.AVALANCHE) {
        return "https://rpc.ankr.com/avalanche";
    } else if(chainID == Networks.MOONRIVER) {
        return "https://rpc.api.moonriver.moonbeam.network/";
    } else if(chainID == Networks.FANTOM) {
        return "https://rpc.ftm.tools/";
    } else if(chainID == Networks.CRONOS) {
        return "https://evm.cronos.org/";
    } else {
        return "https://bsc-dataseed.binance.org/";
    }

    return "";
};

export const isCorrectNetwork = (networkID: number) => {
    if(networkID == 56 || networkID == 43114 || networkID == 250 || networkID == 25 || networkID == 1285) return true;
    else false;
}

export const DEFAULD_NETWORK = Networks.BSC;
