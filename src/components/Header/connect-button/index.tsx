import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../../hooks";
import { DEFAULD_NETWORK, isCorrectNetwork } from "../../../constants";
import { IReduxState } from "../../../store/slices/state.interface";
import { IPendingTxn } from "../../../store/slices/pending-txns-slice";
import "./connect-menu.scss";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import WalletIcon from "src/assets/icons/wallet.png";
import ExitIcon from "src/assets/icons/exit.png";

function ConnectMenu() {
    const { connect, disconnect, connected, web3, providerChainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();
    const [isConnected, setConnected] = useState(connected);

    const isVerySmallScreen = useMediaQuery("(max-width: 500px)");

    let pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    let buttonText = "Connect Wallet";
    let clickFunc: any = connect;
    let buttonStyle = {};

    if (isConnected) {
        buttonText = "Disconnect";
        clickFunc = disconnect;
    }

    if (pendingTransactions && pendingTransactions.length > 0) {
        buttonText = `${pendingTransactions.length} Pending `;
        clickFunc = () => {};
    }

    // if (isConnected && !isCorrectNetwork(providerChainID)) {
    //     buttonText = "Wrong network";
    //     buttonStyle = { backgroundColor: "rgb(255, 67, 67)" };
    //     clickFunc = () => {
    //         checkWrongNetwork();
    //     };
    // }

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <div className="connect-button" style={buttonStyle} onClick={clickFunc}>
            {!isVerySmallScreen && <p>{buttonText}</p>}
            {isVerySmallScreen && isConnected && <img src={ExitIcon} width="25" />}
            {isVerySmallScreen && !isConnected && <img src={WalletIcon} width="25" />}
            {pendingTransactions.length > 0 && (
                <div className="connect-button-progress">
                    <CircularProgress size={15} color="inherit" />
                </div>
            )}
        </div>
    );
}

export default ConnectMenu;
