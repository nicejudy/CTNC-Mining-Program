import { ethers, BigNumber } from "ethers";
import { Addresses } from "../../constants";
import { WonderMinerAbi, erc20Abi, AltMinerAbi } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, loadAccountDetails } from "./account-slice";
import { error, info } from "../slices/messages-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import Cookies from 'universal-cookie';

interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

interface IActionValueAsyncThunk {
  networkID: number;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  action: string;
  value: string;
  account: string;
  callback?: () => void;
  token: number;
}

export const onStake = createAsyncThunk(
  "stake/onStake",
  async ({ networkID, provider, action, value, account, callback, token }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error({text: "Please connect your wallet!"}));
      return;
    }

    const signer = provider.getSigner();

    let minerContract = new ethers.Contract(Addresses.ETHMINER, WonderMinerAbi, signer);
    if (token == 1) {
        minerContract = new ethers.Contract(Addresses.CMLMINER, AltMinerAbi, signer);
    }

    const tokenContract = new ethers.Contract(Addresses.CARAMEL, erc20Abi, signer)

    const cookies = new Cookies();
    let ref
    if(cookies.get('ref')) {
      if(ethers.utils.isAddress(cookies.get('ref'))) {
        ref = cookies.get('ref')
      }
    } else {
      ref = "0x0000000000000000000000000000000000000000"
    }

    let stakeTx;

    try {
      if (action === "hire") {
        if (token == 0) stakeTx = await minerContract.hireFarmers(ref, {value: ethers.utils.parseEther(value)});
        else {
          const approvedBalance = await tokenContract.allowance(account, minerContract.address);
          if (approvedBalance < parseInt(value)) {
            const approveTx = await tokenContract.approve(minerContract.address, "10000000000000000000000000");
            await approveTx.wait();
          }
          stakeTx = await minerContract.buyEggs(ref, value);
        }
        console.log(11111);
      } else if (action === "rehire"){
        if (token == 0) stakeTx = await minerContract.hireMoreFarmers(true);
        else stakeTx = await minerContract.hatchEggs(true);
      } else if (action === "sell") {
        if (token == 0) stakeTx = await minerContract.sellCrops();
        else stakeTx = await minerContract.sellEggs();
      }
      const pendingTxnType = action;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
      callback?.();
      // dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    await dispatch(loadAccountDetails({ networkID, provider, account, token }));
    return;
  },
);
