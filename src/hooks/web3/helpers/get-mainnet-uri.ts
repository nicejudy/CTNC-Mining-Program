import { Networks } from "src/constants";

export const getMainnetURI = (chainID: number): string => {

    if (chainID == Networks.BSC) {
        return "https://bsc-dataseed.binance.org/";
    } else if(chainID == Networks.AVALANCHE) {
        return "https://rpc.ankr.com/avalanche";
    } else if(chainID == Networks.MOONRIVER) {
        return "https://rpc.api.moonriver.moonbeam.network/";
    } else if(chainID == Networks.FANTOM) {
        return "https://rpc.ankr.com/fantom";
    } else if(chainID == Networks.CRONOS) {
        return "https://evm.cronos.org/";
    } else {
        throw Error("Network don't support");
    }

    return "";
};
