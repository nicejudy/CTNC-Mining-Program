import { BigNumber, ethers } from "ethers";
import { getAddresses } from "../../constants";
import { WonderMinerAbi, erc20Abi, AltMinerAbi } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RootState } from "../store";
import axios from "axios"

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
    token: number;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider, token }: ILoadAppDetails) => {

        const addresses = getAddresses(networkID);
        let minerContract = new ethers.Contract(addresses.WONDERMINER, WonderMinerAbi, provider);
        if (token == 1) {
            minerContract = new ethers.Contract(addresses.ALTMINER1, AltMinerAbi, provider);
        } else if (token == 2) {
            minerContract = new ethers.Contract(addresses.ALTMINER2, AltMinerAbi, provider);
        } else if (token == 3) {
            minerContract = new ethers.Contract(addresses.ALTMINER3, AltMinerAbi, provider);
        }

        let tokenContract = new ethers.Contract(addresses.TOKEN1, erc20Abi, provider)
        if (token == 2) {
            tokenContract = new ethers.Contract(addresses.TOKEN2, erc20Abi, provider)
        } else if (token == 3) {
            tokenContract = new ethers.Contract(addresses.TOKEN3, erc20Abi, provider)
        }

        let tokenDecimal = 18;
        if (token != 0) {
            tokenDecimal = (await tokenContract.decimals()) * 1;
        }

        const siteData = await minerContract.getSiteInfo();
        
        const TVL = Number(siteData[0]) / Math.pow(10, tokenDecimal);
        const totalStakers = Number(siteData[1]);
        const totalCompound = Number(siteData[2]) / Math.pow(10, tokenDecimal);
        const totalRef = Number(siteData[3]) / Math.pow(10, tokenDecimal);

        const EGGS_TO_HATCH_1MINERS = (await minerContract.EGGS_TO_HIRE_1MINERS()) * 1;
        const DAILY_RATE = 100 / (EGGS_TO_HATCH_1MINERS / 86400);

        const COMPOUND_BONUS = (await minerContract.COMPOUND_BONUS()) * 0.1;
        const REFERRAL = (await minerContract.REFERRAL()) * 0.1;
        const COMPOUND_STEP = (await minerContract.COMPOUND_STEP()) * 1;
        const CUTOFF_STEP = (await minerContract.CUTOFF_STEP()) * 1;
        const WITHDRAW_COOLDOWN = (await minerContract.WITHDRAW_COOLDOWN()) * 1;
        const COMPOUND_FOR_NO_TAX_WITHDRAWAL = (await minerContract.COMPOUND_FOR_NO_TAX_WITHDRAWAL()) * 1;
        const WITHDRAWAL_TAX = (await minerContract.WITHDRAWAL_TAX()) * 0.1;

        const TAX = (await minerContract.TAX()) * 0.1;

        let contractBalanceString;
        if (token == 0) {
            contractBalanceString = (await provider.getBalance(addresses.WONDERMINER)).toString();
        } else {
            contractBalanceString = (await minerContract.getBalance()).toString();
        }
        const contractBalance = Number(contractBalanceString) / Math.pow(10, tokenDecimal);

        const MIN_INVEST_LIMIT = (await minerContract.MIN_INVEST_LIMIT()) / Math.pow(10, tokenDecimal);
        const WALLET_DEPOSIT_LIMIT = (await minerContract.WALLET_DEPOSIT_LIMIT()) / Math.pow(10, tokenDecimal);

        return {
            networkID,
            provider,
            contractBalance,
            TVL,
            totalStakers,
            totalCompound,
            totalRef,
            DAILY_RATE,
            COMPOUND_BONUS,
            REFERRAL,
            COMPOUND_STEP,
            CUTOFF_STEP,
            WITHDRAW_COOLDOWN,
            COMPOUND_FOR_NO_TAX_WITHDRAWAL,
            WITHDRAWAL_TAX,
            TAX,
            MIN_INVEST_LIMIT,
            WALLET_DEPOSIT_LIMIT,
            tokenDecimal
        };
    },
);

const initialState = {
    loading: true,
};

export interface IAppSlice {
    networkID: number;
    provider: JsonRpcProvider;
    loading: boolean;
    contractBalance: number;
    TVL: number;
    totalStakers: number;
    totalCompound: number;
    totalRef: number;
    DAILY_RATE: number;
    COMPOUND_BONUS: number;
    REFERRAL: number;
    COMPOUND_STEP: number;
    CUTOFF_STEP: number;
    WITHDRAW_COOLDOWN: number;
    COMPOUND_FOR_NO_TAX_WITHDRAWAL: number;
    WITHDRAWAL_TAX: number;
    TAX: number;
    MIN_INVEST_LIMIT: number;
    WALLET_DEPOSIT_LIMIT: number;
    tokenDecimal: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
