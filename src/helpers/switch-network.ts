import { Networks } from "../constants/blockchain";

const switchRequest = (chainId: string) => {
    return window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
    });
};

const addChainRequest = (chainId: string) => {
    let chainName;
    let rpcUrls;
    let blockExplorerUrls;
    let nativeCurrency;

    if (chainId == "0xa86a") {
        chainName = "Avalanche Mainnet";
        rpcUrls = ["https://api.avax.network/ext/bc/C/rpc"];
        blockExplorerUrls = ["https://cchain.explorer.avax.network/"];
        nativeCurrency = {
            name: "AVAX",
            symbol: "AVAX",
            decimals: 18,
        };
    } else if (chainId == "0x38") {
        chainName = "BSC Mainnet";
        rpcUrls = ["https://bsc-dataseed1.defibit.io"];
        blockExplorerUrls = ["https://bscscan.com/"];
        nativeCurrency = {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
        };
    } else if (chainId == "0xfa") {
        chainName = "Fantom Mainnet";
        rpcUrls = ["https://rpc.ftm.tools"];
        blockExplorerUrls = ["https://ftmscan.com/"];
        nativeCurrency = {
            name: "FTM",
            symbol: "FTM",
            decimals: 18,
        };
    } else if (chainId == "0x89") {
        chainName = "Polygon Mainnet";
        rpcUrls = ["https://polygon-rpc.com"];
        blockExplorerUrls = ["https://polygonscan.com/"];
        nativeCurrency = {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        };
    } else if (chainId == "0x19") {
        chainName = "Cronos Mainnet";
        rpcUrls = ["https://evm.cronos.org"];
        blockExplorerUrls = ["https://cronoscan.com/"];
        nativeCurrency = {
            name: "CRO",
            symbol: "CRO",
            decimals: 18,
        };
    } else if (chainId == "0x505") {
        chainName = "Moonriver Mainnet";
        rpcUrls = ["https://rpc.api.moonriver.moonbeam.network"];
        blockExplorerUrls = ["https://moonriver.moonscan.io/"];
        nativeCurrency = {
            name: "MOVR",
            symbol: "MOVR",
            decimals: 18,
        };
    }
    return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
            {
                chainId: chainId,
                chainName: chainName,
                rpcUrls: rpcUrls,
                blockExplorerUrls: blockExplorerUrls,
                nativeCurrency: nativeCurrency,
            },
        ],
    });
};

export const swithNetwork = async (chainId: string) => {
    if (window.ethereum) {
        try {
            await switchRequest(chainId);
        } catch (error: any) {
            if (error.code === 4902) {
                try {
                    await addChainRequest(chainId);
                    await switchRequest(chainId);
                } catch (addError) {
                    console.log(error);
                }
            }
            console.log(error);
        }
    }
};
