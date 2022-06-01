import React, { useMemo, useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from 'ethers';
import Cookies from 'universal-cookie';
import { useQueryParam, StringParam } from 'use-query-params';
import { Grid, InputAdornment, OutlinedInput, Zoom, Button, Link, Modal, Paper, IconButton, SvgIcon, Box } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./main.scss";
import { getMainnetURI, getAddresses } from "src/constants";
import { useWeb3Context } from "src/hooks";
import { IReduxState } from "src/store/slices/state.interface";
import { IAppSlice, loadAppDetails } from "src/store/slices/app-slice";
import { IAccountSlice, loadAccountDetails } from "src/store/slices/account-slice";
import { IPendingTxn, isPendingTxn } from "src/store/slices/pending-txns-slice";
import { onStake } from "src/store/slices/stake-slice";
import { error } from "src/store/slices/messages-slice";
import TreasuryIcon from "src/assets/icons/treasury.png";
import ContractIcon from "src/assets/icons/lock.png";
import ReferralIcon from "src/assets/icons/referral.png";
import StakerIcon from "src/assets/icons/users.png";
import WithdrawIcon from "src/assets/icons/withdraw.png";
import { trim } from "src/helpers";
import TelegramIcon from "src/assets/icons/telegram.svg";
import TwitterIcon from "src/assets/icons/twitter.svg";
import AuditIcon from "src/assets/icons/audit.svg";
import BscscanIcon from "src/assets/icons/bscscan.svg";
import ArrowIcon from "src/assets/icons/arrowup.png";
import {ReactComponent as XIcon} from "src/assets/icons/x.svg";

import BnbIcon from "src/assets/tokens/bnb.png";
import AvaxIcon from "src/assets/tokens/avax.png";
import CroIcon from "src/assets/tokens/cro.png";
import FtmIcon from "src/assets/tokens/ftm.png";
import MovrIcon from "src/assets/tokens/movr.png";
import BusdIcon from "src/assets/tokens/busd.png";
import CakeIcon from "src/assets/tokens/cake.png";
import MimIcon from "src/assets/tokens/mim.png";
import UstIcon from "src/assets/tokens/ust.png";
import FusdtIcon from "src/assets/tokens/usdt.png";
import BooIcon from "src/assets/tokens/boo.png";
import SolarIcon from "src/assets/tokens/solar.png";
import DaiIcon from "src/assets/tokens/dai.png";
import DarkIcon from "src/assets/tokens/dark.png";
import MmfIcon from "src/assets/tokens/mmf.png";
import KronosIcon from "src/assets/icons/kronos.png";
import KronosIcon1 from "src/assets/icons/kronos1.png";
import AuditBadge from "src/assets/svg/audit.svg";
import { getAddress } from "ethers/lib/utils";
import { LaptopWindows } from "@material-ui/icons";

function Main() {
    const isVerySmallScreen = useMediaQuery("(max-width: 500px)");
    const dispatch = useDispatch();
    const { provider, address, providerChainID, checkWrongNetwork } = useWeb3Context();
    
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const account = useSelector<IReduxState, IAccountSlice>(state => state.account);

    const [stakeAmount, setStakeAmount] = useState("");
    const [coinName, setCoinName] = useState("BNB");
    const [chainName, setChainName] = useState("BSC");
    const [claimTime, setClaimTime] = useState("--:--:--");
    const [compoundTime, setCompoundTime] = useState("--:--:--");
    const [coolDownTime, setCoolDownTime] = useState("--:--:--");
    const [tokens, setTokens] = useState(["BNB", "BUSD", "CAKE", "KRONOS"]);
    const [tokenId, setTokenId] = useState(0);
    const [tokenIcons, setTokenIcons] = useState([BnbIcon, BusdIcon, CakeIcon]);

    const [active1, setActive1] = useState("-active");
    const [active2, setActive2] = useState("");
    const [active3, setActive3] = useState("");
    const [active4, setActive4] = useState("");

    const [grids, setGrids] = useState(4);

    const cookies = new Cookies();
    const [ref, setNum] = useQueryParam('ref', StringParam);
    if(ref) {
        if(ethers.utils.isAddress(ref)) {
          cookies.set("ref", ref)
        }
    }

    const onChangeToken = async(token: number) => {
        if (tokenId == token) return;
        setTokenId(token);
        cookies.set("tokenId", token);
        const staticProvider = new StaticJsonRpcProvider(getMainnetURI(providerChainID));
        await dispatch(loadAppDetails({ networkID: providerChainID, provider: staticProvider, token }));
        await dispatch(loadAccountDetails({ networkID: providerChainID, provider: staticProvider, account: address, token }));
    }

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const onChangeStake = async (action: string) => {
        let value;
        value = stakeAmount == "" ? "0" : stakeAmount;
        if (action === "hire" && (value === "0" || value === "")) {
            // eslint-disable-next-line no-alert
            return dispatch(error({ text: "Please enter a value!" }));
        }
        if (action === "hire" && parseFloat(value) > account.ethBalance) {
            return dispatch(error({ text: `You cannot stake more ${coinName} than your balance.` }));
        }

        if (action === "hire" && tokenId != 0) {
            if (parseFloat(value) < app.MIN_INVEST_LIMIT) return dispatch(error({ text: `You cannot stake less ${coinName} than minimum.` }));
            if (parseFloat(value) > app.WALLET_DEPOSIT_LIMIT) return dispatch(error({ text: `You cannot stake more ${coinName} than maximum.` }));
            value = parseFloat(value) * Math.pow(10, app.tokenDecimal);
        }

        dispatch(
            await onStake({
                networkID: providerChainID,
                action,
                value: value.toString(),
                provider: provider,
                account: address,
                callback: () => setStakeAmount(""),
                token: tokenId,
            }),
        );
    }

    const Clipboard = () => {
        navigator.clipboard.writeText(`https://wonderminer.app?ref=${account.address}`);
    }

    const [openFaq, setOpenFaq] = useState(false);
    const handleOpenFaq = () => setOpenFaq(true);
    const handleCloseFaq = () => setOpenFaq(false);

    const refScrollUp = useRef(document.createElement("div"));

    const scrollToTop = () => {
        refScrollUp.current.scrollIntoView({ behavior: "smooth" });
    }

    const gotoAudit = () => {
        window.open("https://github.com/coinscope-co/audits/blob/main/15-bnb/audit.pdf", "_blank");
    }

    const calculateTimeLeft = (lastTime: number, period: number) => {
        const timeLeftStamp = lastTime + period - Math.floor(Date.now() / 1000);
        if (timeLeftStamp <= 0) return "--:--:--";
        const hours = timeLeftStamp / 3600 | 0;
        return `${hours}${new Date(timeLeftStamp * 1000).toISOString().substring(13, 19)}`;
    };

    useEffect(() => {
        let timer = setInterval(() => {
            if (account.lastHatch > 0 && !isAppLoading) {
                setClaimTime(calculateTimeLeft(account.lastHatch, app.CUTOFF_STEP));
                setCompoundTime(calculateTimeLeft(account.lastHatch, app.COMPOUND_STEP));
                setCoolDownTime(calculateTimeLeft(account.lastHatch, app.WITHDRAW_COOLDOWN));
            }
        }, 1000);
        return () => clearInterval(timer);
    });

    useEffect(() => {
        const root = document.documentElement;

        if (providerChainID == 56) {
            root?.style.setProperty("--coin-color", "#E1A900");
            root?.style.setProperty("--bg-color", "#2c2a0088");
            root?.style.setProperty("--faq-bg-color", "#2c2a00cc");
            root?.style.setProperty("--viewbase-bg-color", "#222114");
            root?.style.setProperty("--btn-active-color", "#E1A900bb");
            setChainName("BSC");
            setTokens(["BNB", "BUSD", "CAKE", "KRONOS"]);
            setTokenIcons([BnbIcon, BusdIcon, CakeIcon, KronosIcon1]);
            setGrids(3);
            setTokenId(0);
        };
        if (providerChainID == 43114) {
            root?.style.setProperty("--coin-color", "#e13f3f");
            root?.style.setProperty("--bg-color", "#240c0c88");
            root?.style.setProperty("--faq-bg-color", "#240c0ccc");
            root?.style.setProperty("--viewbase-bg-color", "#241818");
            root?.style.setProperty("--btn-active-color", "#e13f3fbb");
            setChainName("Avalanche");
            setTokens(["AVAX", "MIM", "USDC.e", ""]);
            setTokenIcons([AvaxIcon, MimIcon, "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664/logo.png"]);
            setGrids(4);
            setTokenId(0);
        }
        if (providerChainID == 250) {
            root?.style.setProperty("--coin-color", "#0bafe5");
            root?.style.setProperty("--bg-color", "#00222e88");
            root?.style.setProperty("--faq-bg-color", "#00222ecc");
            root?.style.setProperty("--viewbase-bg-color", "#131818");
            root?.style.setProperty("--btn-active-color", "#0bafe5bb");
            setChainName("Fantom");
            setTokens(["FTM", "fUSDT", "BOO", ""]);
            // setTokenIcons([FtmIcon, FusdtIcon, BooIcon]);
            setTokenIcons([
                FtmIcon,
                FusdtIcon,
                BooIcon
            ]);
            setGrids(4);
            setTokenId(0);
        }
        if (providerChainID == 25) {
            root?.style.setProperty("--coin-color", "#4e6ccf");
            root?.style.setProperty("--bg-color", "#171a2588");
            root?.style.setProperty("--faq-bg-color", "#171a25cc");
            root?.style.setProperty("--viewbase-bg-color", "#10121a");
            root?.style.setProperty("--btn-active-color", "#4e6ccfbb");
            setChainName("Cronos");
            setTokens(["CRO", "DARK", "MMF", ""]);
            setTokenIcons([
                CroIcon,
                DarkIcon,
                MmfIcon
            ]);
            setGrids(4);
            setTokenId(0);
        }
        if (providerChainID == 1285) {
            root?.style.setProperty("--coin-color", "#54cac6");
            root?.style.setProperty("--bg-color", "#172e2d88");
            root?.style.setProperty("--faq-bg-color", "#172e2dcc");
            root?.style.setProperty("--viewbase-bg-color", "#1a2222");
            root?.style.setProperty("--btn-active-color", "#54cac6bb");
            setChainName("Moonriver");
            setTokens(["MOVR", "DAI", "SOLAR", ""]);
            setTokenIcons([MovrIcon, DaiIcon, SolarIcon]);
            setGrids(4);
            setTokenId(0);
        }
        onChangeToken(tokenId);
    }, [providerChainID]);

    useEffect(() => {
        setCoinName(tokens[tokenId]);
        if (tokenId == 0) {
            setActive1("-active");
            setActive2("");
            setActive3("");
            setActive4("");
        }
        if (tokenId == 1) {
            setActive1("");
            setActive2("-active");
            setActive3("");
            setActive4("");
        }
        if (tokenId == 2) {
            setActive1("");
            setActive2("");
            setActive3("-active");
            setActive4("");
        }
        if (tokenId == 3) {
            setActive1("");
            setActive2("");
            setActive3("");
            setActive4("-active");
        }
    }, [tokens, tokenId]);

    const [explorer, setExplorer] = useState("https://bscscan.com/address/0xA3b67B202495ff851eD85bF64B9e96ADcf9e5fA7");

    useEffect(() => {
        const addresses = getAddresses(providerChainID);
        let contract = "";
        if (tokenId == 0) {
            contract = addresses.WONDERMINER;
        }
        if (tokenId == 1) {
            contract = addresses.ALTMINER1;
        }
        if (tokenId == 2) {
            contract = addresses.ALTMINER2;
        }
        if (tokenId == 3) {
            contract = addresses.ALTMINER3;
        }
        setExplorer(`${addresses.EXPLORER}${contract}`);
    }, [providerChainID, tokenId]);

    return (
        <div className="main-view">
            <div ref={refScrollUp}></div>
            <div style={{height: "190px"}}></div>
            <div className="main-select">
                <div className={`main-select-btn${active1}`} onClick={() => onChangeToken(0)}>
                    <p>{tokens[0]}</p>
                    <img src={tokenIcons[0]} width="48" />
                </div>
                <div className={`main-select-btn${active2}`} onClick={() => onChangeToken(1)}>
                    <p>{tokens[1]}</p>
                    <img src={tokenIcons[1]} width="48" />
                </div>
                <div className={`main-select-btn${active3}`} onClick={() => onChangeToken(2)}>
                    <p>{tokens[2]}</p>
                    <img src={tokenIcons[2]} width="48" />
                </div>
                {providerChainID == 56 && (
                    <div className={`main-select-btn${active4}`} onClick={() => onChangeToken(3)}>
                        <p>{tokens[3]}</p>
                        <img src={tokenIcons[3]} width="48" />
                    </div>
                )}
            </div>
            <div className="main-intro">
                <div className="main-intro-header">
                    <p className="main-intro-header-welcome">Welcome to</p>
                    <p className="main-intro-header-name">The WonderMiner.</p>
                    <p className="main-intro-header-desc">A smart and sustainable way to grow your <span className="coin-name">{coinName}</span> on the {chainName}</p>

                </div>
                <div className="main-intro-body">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div className="main-intro-body-side">
                                <div className="main-intro-body-header">
                                    <p>Statistics</p>
                                </div>
                                <div className="main-intro-body-box">
                                    <img src={ContractIcon} width="30" />
                                    <div>
                                        <p className="intro-box-title">TVL</p>
                                        <p className="intro-box-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.TVL, 2)} ${coinName}`}</p>
                                    </div>
                                </div>
                                <div className="main-intro-body-box">
                                    <img src={ReferralIcon} width="30" />
                                    <div>
                                        <p className="intro-box-title">Total Referral</p>
                                        <p className="intro-box-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.totalRef, 2)} ${coinName}`}</p>
                                    </div>
                                </div>
                                <div className="main-intro-body-box">
                                    <img src={TreasuryIcon} width="30" />
                                    <div>
                                        <p className="intro-box-title">Contract</p>
                                        <p className="intro-box-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.contractBalance, 2)} ${coinName}`}</p>
                                    </div>
                                </div>
                                <div className="main-intro-body-box">
                                    <img src={StakerIcon} width="30" />
                                    <div>
                                        <p className="intro-box-title">Total Miners</p>
                                        <p className="intro-box-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.totalStakers, 2)}`}</p>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div className="main-intro-body-side">
                                <div className="main-intro-body-header">
                                    <p>Benefits</p>
                                </div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.DAILY_RATE, 2)}`}% Daily ~ {isAppLoading ? 0 : `${trim(app.DAILY_RATE * 365, 2)}`}% APR</p></div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.COMPOUND_BONUS, 2)}`}% Compound Bonus</p></div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.REFERRAL, 2)}`}% Referrals</p></div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.COMPOUND_STEP / 3600, 2)}`}h Compound Timer</p></div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.WITHDRAW_COOLDOWN / 3600, 2)}`}h Withdraw Cooldown</p></div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.CUTOFF_STEP / 3600, 2)}`}h Rewards Accumulation Cut-Off</p></div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.COMPOUND_FOR_NO_TAX_WITHDRAWAL, 2)}`} Times Mandatory Compound Feature</p></div>
                                <div className="main-intro-body-row"><p>🎁 {isAppLoading ? 0 : `${trim(app.WITHDRAWAL_TAX, 2)}`}% Penalty For Early Withdrawals</p></div>
                                <div className="main-intro-body-row"><p>🎁 Anti-Bot Launch</p></div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <div className="main-dashboard">
                <div className="main-dashboard-header">
                    <p>Your Dashboard</p>
                </div>
                <div className="main-dashboard-infos">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <div className="main-dashboard-card">
                                <img src={TreasuryIcon} width="30" />
                                <p className="main-dashboard-card-title">Initial Deposit</p>
                                <p className="main-dashboard-card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(account.initialDeposit, 2)} ${coinName}`}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <div className="main-dashboard-card">
                                <img src={TreasuryIcon} width="30" />
                                <p className="main-dashboard-card-title">Total Deposit</p>
                                <p className="main-dashboard-card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(account.userDeposit, 2)} ${coinName}`}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <div className="main-dashboard-card">
                                <img src={WithdrawIcon} width="30" />
                                <p className="main-dashboard-card-title">Withdrawn</p>
                                <p className="main-dashboard-card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(account.totalWithdrawn, 2)} ${coinName}`}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3}>
                            <div className="main-dashboard-card">
                                <img src={ReferralIcon} width="30" />
                                <p className="main-dashboard-card-title">Referrals</p>
                                <p className="main-dashboard-card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(account.referralEggRewards, 2)} ${coinName}`}</p>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <div className="main-dashboard-wrap">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div className="main-dashboard-box">
                                <div className="dashboard-wallet">
                                    <p className="wallet-balance-title">Wallet Balance: </p>
                                    <p className="wallet-balance-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(account.ethBalance, 3)} ${coinName}`}</p>
                                </div>
                                <div className="dashboard-timer">
                                    <p className="timer-desc">Cart will be full in</p>
                                    <p className="timer-value">{claimTime}</p>
                                </div>
                                <div className="dashboard-timer">
                                    <p className="timer-desc">Time until next hire bonus is activated:</p>
                                    <p className="timer-value">{compoundTime}</p>
                                </div>
                                <div className="dashboard-deposit">
                                    <p className="deposit-text">
                                        Deposit&nbsp;
                                        <span className="coin-name">{coinName}</span>
                                        &nbsp;(min&nbsp;{isAppLoading ? 0 : `${trim(app.MIN_INVEST_LIMIT, 3)}`}, max {isAppLoading ? 0 : `${trim(app.WALLET_DEPOSIT_LIMIT, 3)}`})
                                    </p>
                                    <OutlinedInput
                                        type="number"
                                        placeholder="0"
                                        className="deposit-input"
                                        value={stakeAmount}
                                        onChange={e => setStakeAmount(e.target.value)}
                                        labelWidth={0}
                                        endAdornment={
                                            <div className="card-select-input-end">
                                                <p>{coinName}</p>
                                            </div>
                                        }
                                    />
                                    <Button
                                        className="deposit-button"
                                        variant="contained"
                                        color="primary"
                                        disabled={isPendingTxn(pendingTransactions, "staking")}
                                        onClick={() => {
                                            onChangeStake("hire");
                                        }}
                                    >
                                        <p>Hire 0 Miners</p>
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <div className="main-dashboard-box">
                                <div className="dashboard-wallet">
                                    <p className="wallet-balance-value">{isAppLoading ? 0 : `${trim(account.miners, 3)}`} Miners </p>
                                    <p className="wallet-balance-value">{isAppLoading ? 0 : `${trim(account.pendingEarning, 5)} ${coinName}`}</p>
                                </div>
                                <div className="dashboard-timer">
                                    <p className="timer-desc">Estimated Daily Yield:</p>
                                    <p className="timer-value">{isAppLoading ? 0 : `${trim(account.dailyYieldEarning, 5)} ${coinName}`}</p>
                                </div>
                                <div className="dashboard-timer">
                                    <p className="timer-desc">Compound Count:</p>
                                    <p className="timer-value">{isAppLoading ? 0 : `${trim(account.dailyCompoundBonus, 3)}`} Time/s</p>
                                </div>
                                <div className="dashboard-deposit">
                                    <p className="sell-button-top">({isAppLoading ? 0 : `-${trim(app.WITHDRAWAL_TAX, 2)}`}% tax for early sell)</p>
                                    <Button
                                        className="sell-button"
                                        variant="contained"
                                        color="primary"
                                        disabled={isPendingTxn(pendingTransactions, "staking")}
                                        onClick={() => {
                                            onChangeStake("sell");
                                        }}
                                    >
                                        <p>Sell in {coolDownTime}</p>
                                    </Button>
                                    <p className="compound-button-top">({isAppLoading ? 0 : `${trim(app.COMPOUND_BONUS, 2)}`}% compound bonus)</p>
                                    <Button
                                        className="hire-more-button"
                                        variant="contained"
                                        color="primary"
                                        disabled={isPendingTxn(pendingTransactions, "staking")}
                                        onClick={() => {
                                            onChangeStake("rehire");
                                        }}
                                    >
                                        <p>Hire More Miners</p>
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                <div className="main-referral">
                    <div className="main-referral-header">
                        <p>Your Referral Link</p>
                    </div>
                    <div className="main-referral-body">
                        <OutlinedInput
                            className="referral-link"
                            value={`https://wonderminer.app?ref=${account.address}`}
                            endAdornment={
                                <InputAdornment position="end">
                                    <div className="referral-link-btn" onClick={Clipboard}>
                                        <p>Copy</p>
                                    </div>
                                </InputAdornment>
                            }
                        />
                    </div>
                    <div className="main-referral-footer">
                        <p>Earn {isAppLoading ? 0 : `${trim(app.REFERRAL, 2)}`}% when someone uses your referral link</p>
                    </div>
                </div>
            </div>
            <div className="main-footer">
                {!isVerySmallScreen && (
                    <div className="main-footer-item" >
                        <a href="https://farms.kronosdao.ai/farms" target="_blank">
                            <img src={KronosIcon} alt="Kronos Dao" height="25" />
                        </a>
                    </div>
                )}
                <div className="main-footer-wrap">
                    {isVerySmallScreen && (
                        <div className="main-footer-item" >
                            <a href="https://farms.kronosdao.ai/farms" target="_blank">
                                <img src={KronosIcon1} alt="Kronos Dao" height="30" />
                            </a>
                        </div>
                    )}
                    <div className="main-footer-item">
                        <a href={explorer} target="_blank">
                            <img src={BscscanIcon} alt="Contract on explorer" />
                        </a>
                    </div>
                    <div className="main-footer-item">
                        <a href="https://www.coinscope.co/coin/15-bnb" target="_blank">
                            <img src={AuditIcon} alt="Audit" />
                        </a>
                    </div>
                    <div className="main-footer-item">
                        <a href="https://t.me/KRONOS_community" target="_blank">
                            <img src={TelegramIcon} alt="Telegram" />
                        </a>
                    </div>
                    <div className="main-footer-item">
                        <a href="https://twitter.com/dao_kronos" target="_blank">
                            <img src={TwitterIcon} alt="Twitter" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="main-scroll-btn" onClick={scrollToTop}>
                <img src={ArrowIcon} alt="Arrow Up" />
            </div>
            <div className="main-badge-btn" onClick={gotoAudit}>
                <img src={AuditBadge} alt="Audit Badge" />
            </div>
            <div className="main-faq-btn" onClick={handleOpenFaq}>
                <p>?</p>
            </div>
            <Modal className="main-modal" open={openFaq} onClose={handleCloseFaq} hideBackdrop>
                <Paper className="main-modal-paper">
                    <div className="main-modal-header">
                        <div className="main-modal-title">
                            <p></p>
                        </div>
                        <IconButton onClick={handleCloseFaq}>
                            <SvgIcon color="primary" component={XIcon} />
                        </IconButton>
                    </div>
                    <Box className="main-modal-body">
                        <div className="main-modal-row">
                            <p className="main-modal-row-header">FAQs</p>
                            <p className="main-modal-row-title">1: What is the {coinName} WonderMiner?</p>
                            <p className="main-modal-row-text">The {coinName} WonderMiner is a decentralized application built on the {chainName} Network. The object of the game is to hire more miners sooner and more often than other players. This in turn earns you more {coinName} faster. These Miners work for you tirelessly, giving you a daily average of 8% of your miners' value.</p>
                            <p className="main-modal-row-text">The daily percentage return depends on players' actions that are taken within the platform that impact the miners's efficiency rate. The mining efficiency rate rises and falls as users buy Miners, re-hire your earnings and sell your Eggs for {coinName}.</p>
                            <p className="main-modal-row-text">Once Miners are Bought, they cannot be sold, and the investment made to re-hire them (either through hire or re-hiring) cannot be taken back. However, once bought, Miners will not stop producing yield.</p>
                            <p className="main-modal-row-title">2: What makes it different from other similar platforms?</p>
                            <p className="main-modal-row-text">The {coinName} WonderMiner has several anti-dumping and anti-whale measures in place to ensure the longevity of the project. These measures include maximum deposits, as well as a cutoff time AND a cooldown time for withdrawals.</p>
                            <p className="main-modal-row-text">The cutoff time is the amount of time it will take for your "cart" to be full of rewards. Once the bag is full, it will stop filling until you've taken some action in the game. This is to prevent whales from letting their rewards accumulate for a long time, and removes the false impression the contract value is going up when most of it is rewards the whale is waiting to withdraw at once.</p>
                            <p className="main-modal-row-text">The withdraw cooldown time is the amount of time one has to wait before they can make another withdrawal. This also prevents the contract balance from decreasing in value too fast. If the team decides it's necessary to protect the contract balance, this time period can be adjusted to slow down the rate of withdrawals, but it can only be set to a value less than or equal to 24 hours (per contract rules).</p>
                            <p className="main-modal-row-text">The compound count is the number of times the user has compounded. By default, the required compound count by the platform is 10, meaning the user will have to compound 10 times(compound once every 12 hours) before they can withdraw without the feedback tax of 80%. This feature in essense will ensure the longevity and stability of the project.</p>
                            <p className="main-modal-row-text">To reward users who compound, there is a bonus when you re-hire your daily crops earnings instead of selling them. The bonus increases 4% every 12 hours that you compound without withdrawing (40% max after 5 days). This incentivizes the user to compound more often, which will help boost the mines efficiency rate in the long run. To be able to utilize the re-hire bonus feature, the player must not compound before the provided timer reaches 00:00:00.</p>
                            <p className="main-modal-row-text">For the players who choose to not play the game and only sell, there will be a 80% tax on those sells that will stay in the contract. If the player makes two or more consecutive sells, this tax will be applied. The only way for the user to not pay the 80% tax is to compound 10 times before making another withdrawal.</p>
                            <p className="main-modal-row-title">3: How does this platform work?</p>
                            <p className="main-modal-row-text">This platform work similarly to a financial market, where an asset has intrinsic value that is relative to the supply or demand of said asset. Miners are purchased with a pre-determined currency at a price relative to the Miners's current mining efficiency rate. After the Miners are purchased, they go to work for you right away to give you the best yield on your investment possible, for as long as possible. Just as any other asset bought and sold on an open market, the price of a Miners will fluctuate over time, as will the mining efficiency rate, as you and other players recruit Miners, compound earnings and sell earnings. To put it plainly, the more demand for the Miners, the more they will increase in value and the more yield they will produce. Inversely, when the demand decreases, so will the value of the Miners and their daily return on investment.</p>
                            <p className="main-modal-row-text">The main difference between a this game and a traditional financial market is that a recruited Miners cannot be sold, only the value they provide can be sold. As the players of the game as a whole compound their earnings and make new deposits, the game efficiency rate will stay relatively constant, but the moment players start to sell more than they are compounding, the efficiency rate will begin to drop as to preserve the TVL and longevity of the game.</p>
                            <p className="main-modal-row-title">4: What is the recommended strategy?</p>
                            <p className="main-modal-row-text">The best strategy that the team can recommend is to re-hire/compound for 6 days and harvest 1 day a week. This will increase the users investment at the same time increasing the daily yield earnings. This strategy has already been tried and tested by several project and is proven effective both for the short and long term.</p>
                        </div>
                    </Box>
                </Paper>
            </Modal>
        </div>
    )
}

export default Main;