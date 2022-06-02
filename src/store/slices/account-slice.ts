import React from "react";
import { Contract, ethers } from "ethers";
import { Addresses } from "../../constants";
import { WonderMinerAbi, erc20Abi, AltMinerAbi } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { DEFAULD_NETWORK } from "../../constants/blockchain";
import { RootState } from "../store";


interface ILoadAccountDetails {
    account: string;
    networkID: number;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    token: number;
}

interface IUserAccountDetails {
    address: string,
    ethBalance: number;
    initialDeposit: number;
    userDeposit: number;
    miners: number;
    claimedEggs: number;
    lastHatch: number;
    referrer: string;
    referralsCount: number;
    totalWithdrawn: number;
    referralEggRewards: number;
    dailyCompoundBonus: number;
    farmerCompoundCount: number;
    lastWithdrawTime: number;
    pendingEarning: number;
    dailyYieldEarning: number;
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, account, token }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
        let minerContract = new ethers.Contract(Addresses.ETHMINER, WonderMinerAbi, provider);
        if (token == 1) {
            minerContract = new ethers.Contract(Addresses.CMLMINER, AltMinerAbi, provider);
        }

        const tokenContract = new ethers.Contract(Addresses.CARAMEL, erc20Abi, provider)

        const tokenDecimal = 18;

    let ethBalanceString = "";
    if (token == 0) {
        ethBalanceString = (await provider.getBalance(account)).toString();
    } else {
        ethBalanceString = (await tokenContract.balanceOf(account)).toString();
    }

    const ethBalance = Number(ethBalanceString) / Math.pow(10, tokenDecimal);
    const userData = await minerContract.getUserInfo(account);
    const initialDeposit = Number(userData[0]) / Math.pow(10, tokenDecimal);
    const userDeposit = Number(userData[1]) / Math.pow(10, tokenDecimal);
    const miners = Number(userData[2]);
    const claimedEggs = Number(userData[3]);
    const lastHatch = Number(userData[4]);
    const referrer = userData[5];
    const referralsCount = Number(userData[6]);
    const totalWithdrawn = Number(userData[7]) / Math.pow(10, tokenDecimal);
    const referralEggRewards = Number(userData[8]) / Math.pow(10, tokenDecimal);
    const dailyCompoundBonus = Number(userData[9]);
    let farmerCompoundCount = 0;
    let lastWithdrawTime = 0;
    if (token == 0) {
        farmerCompoundCount = Number(userData[10]);
        lastWithdrawTime = Number(userData[11]);
    }
    if (token != 0) {
        lastWithdrawTime = Number(userData[10]);
    }

    const EggsSinceLastHatch = (await minerContract.getEggsSinceLastHatch(account)) * 1;

    let pendingEarning = 0;
    let dailyYieldEarning = 0;
    if (claimedEggs + EggsSinceLastHatch != 0) {
        pendingEarning = await minerContract.getAvailableEarnings(account);
        dailyYieldEarning = (await minerContract.calculateEggSellForYield(miners * 86400, pendingEarning)) / Math.pow(10, 18);
    }

    return {
        address: account,
        ethBalance: ethBalance,
        initialDeposit: initialDeposit,
        userDeposit: userDeposit,
        miners: miners,
        claimedEggs: claimedEggs,
        lastHatch: lastHatch,
        referrer: referrer,
        referralsCount: referralsCount,
        totalWithdrawn: totalWithdrawn,
        referralEggRewards: referralEggRewards,
        dailyCompoundBonus: dailyCompoundBonus,
        farmerCompoundCount: farmerCompoundCount,
        lastWithdrawTime: lastWithdrawTime,
        pendingEarning: pendingEarning / Math.pow(10, tokenDecimal),
        dailyYieldEarning: dailyYieldEarning
    };
});

export interface IAccountSlice {
    loading: boolean;
    address: string,
    ethBalance: number;
    initialDeposit: number;
    userDeposit: number;
    miners: number;
    claimedEggs: number;
    lastHatch: number;
    referrer: string;
    referralsCount: number;
    totalWithdrawn: number;
    referralEggRewards: number;
    dailyCompoundBonus: number;
    farmerCompoundCount: number;
    lastWithdrawTime: number;
    pendingEarning: number;
    dailyYieldEarning: number;
}

const initialState: IAccountSlice = {
    loading: true,
    address: "",
    ethBalance: 0,
    initialDeposit: 0,
    userDeposit: 0,
    miners: 0,
    claimedEggs: 0,
    lastHatch: 0,
    referrer: "",
    referralsCount: 0,
    totalWithdrawn: 0,
    referralEggRewards: 0,
    dailyCompoundBonus: 0,
    farmerCompoundCount: 0,
    lastWithdrawTime: 0,
    pendingEarning: 0,
    dailyYieldEarning: 0
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
