import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../../hooks";
import BSCIcon from "../../../assets/svg/bsc.svg";
import AvaxIcon from "../../../assets/svg/avax.svg";
import FtmIcon from "../../../assets/svg/ftm.svg";
import CroIcon from "../../../assets/svg/cro.svg";
import MovrIcon from "../../../assets/svg/movr.svg";
import { Link, Fade, Popper } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { getMainnetURI, getAddresses } from "src/constants";
import "./switch-button.scss";
import { loadAccountDetails } from "../../../store/slices/account-slice";
import { loadAppDetails } from "../../../store/slices/app-slice";
import { IReduxState } from "../../../store/slices/state.interface";
import { messages } from "../../../constants/messages";
import { swithNetwork } from "../../../helpers/switch-network";
import { StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { DEFAULD_NETWORK, isCorrectNetwork } from "../../../constants";
import Cookies from 'universal-cookie';

function SwitchButton() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { providerChainID, connected, address } = useWeb3Context();

    const dispatch = useDispatch();

    const isVerySmallScreen = useMediaQuery("(max-width: 500px)");
    const isSmallScreen = useMediaQuery("(max-width: 700px)");

    const cookies = new Cookies();

    const [active1, setActive1] = useState("");
    const [active2, setActive2] = useState("");
    const [active3, setActive3] = useState("");
    const [active4, setActive4] = useState("");
    const [active5, setActive5] = useState("");

    const chainName = () => {
        if (providerChainID == 43114) return "Avalanche";
        else if (providerChainID == 56) return "BSC";
        else if (providerChainID == 250) return "Fantom";
        else if (providerChainID == 137) return "Polygon";
        else if (providerChainID == 25) return "Cronos";
        else if (providerChainID == 1285) return "Moonriver";
    };

    let tokenId = 0;

    const changeNetworkAVAX = async () => {
        if(cookies.get('tokenId')) tokenId = cookies.get('tokenId');
        await swithNetwork("0xa86a");
        const staticProvider = new StaticJsonRpcProvider(getMainnetURI(43114));
        await dispatch(loadAppDetails({ networkID: 43114, provider: staticProvider, token: 0 }));
        await dispatch(loadAccountDetails({ networkID: 43114, provider: staticProvider, account: address, token: 0 }));
    };
    const changeNetworkBSC = async () => {
        if(cookies.get('tokenId')) tokenId = cookies.get('tokenId');
        await swithNetwork("0x38");
        const staticProvider = new StaticJsonRpcProvider(getMainnetURI(56));
        await dispatch(loadAppDetails({ networkID: 56, provider: staticProvider, token: 0 }));
        await dispatch(loadAccountDetails({ networkID: 56, provider: staticProvider, account: address, token: 0 }));
    };
    const changeNetworkFTM = async () => {
        if(cookies.get('tokenId')) tokenId = cookies.get('tokenId');
        await swithNetwork("0xfa");
        const staticProvider = new StaticJsonRpcProvider(getMainnetURI(250));
        await dispatch(loadAppDetails({ networkID: 250, provider: staticProvider, token: 0 }));
        await dispatch(loadAccountDetails({ networkID: 250, provider: staticProvider, account: address, token: 0 }));
    };
    const changeNetworkCRO = async () => {
        if(cookies.get('tokenId')) tokenId = cookies.get('tokenId');
        await swithNetwork("0x19");
        const staticProvider = new StaticJsonRpcProvider(getMainnetURI(25));
        await dispatch(loadAppDetails({ networkID: 25, provider: staticProvider, token: 0 }));
        await dispatch(loadAccountDetails({ networkID: 25, provider: staticProvider, account: address, token: 0 }));
    };
    const changeNetworkMOVR = async () => {
        if(cookies.get('tokenId')) tokenId = cookies.get('tokenId');
        await swithNetwork("0x505");
        const staticProvider = new StaticJsonRpcProvider(getMainnetURI(1285));
        await dispatch(loadAppDetails({ networkID: 1285, provider: staticProvider, token: 0 }));
        await dispatch(loadAccountDetails({ networkID: 1285, provider: staticProvider, account: address, token: 0 }));
    };

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    let buttonText;
    let buttonStyle;
    let imgSource;

    useEffect(() => {

        if (providerChainID == 56) {
            buttonText = "chainName()";
            buttonStyle = { backgroundColor: "#2c2a00" };
            imgSource = BSCIcon;
            setActive1("-active");
            setActive2("");
            setActive3("");
            setActive4("");
            setActive5("");
        } else if (providerChainID == 250) {
            buttonText = chainName();
            buttonStyle = { backgroundColor: "#00222e" };
            imgSource = FtmIcon;
            setActive1("");
            setActive2("");
            setActive3("-active");
            setActive4("");
            setActive5("");
        } else if (providerChainID == 43114) {
            buttonText = chainName();
            buttonStyle = { backgroundColor: "#240c0c" };
            imgSource = AvaxIcon;
            setActive1("");
            setActive2("-active");
            setActive3("");
            setActive4("");
            setActive5("");
        } else if (providerChainID == 25) {
            buttonText = chainName();
            buttonStyle = { backgroundColor: "#171a25" };
            imgSource = CroIcon;
            setActive1("");
            setActive2("");
            setActive3("");
            setActive4("-active");
            setActive5("");
        } else if (providerChainID == 1285) {
            buttonText = chainName();
            buttonStyle = { backgroundColor: "#172e2d" };
            imgSource = MovrIcon;
            setActive1("");
            setActive2("");
            setActive3("");
            setActive4("");
            setActive5("-active");
        } else {
            buttonText = "Unknown";
            buttonStyle = { backgroundColor: "#ff5500" };
        }

    }, [providerChainID]);

    return (
        <div className="time-menu-root">
            {!isSmallScreen && (<div className="time-menu-wrap">
                <div className={`time-menu-item${active1}`} onClick={changeNetworkBSC}>
                    <img src={BSCIcon} width="40" />
                </div>
                <div className={`time-menu-item${active2}`} onClick={changeNetworkAVAX}>
                    <img src={AvaxIcon} width="40" />
                </div>
                <div className={`time-menu-item${active3}`} onClick={changeNetworkFTM}>
                    <img src={FtmIcon} width="40" />
                </div>
                <div className={`time-menu-item${active4}`} onClick={changeNetworkCRO}>
                    <img src={CroIcon} width="40" />
                </div>
                <div className={`time-menu-item${active5}`} onClick={changeNetworkMOVR}>
                    <img src={MovrIcon} width="40" />
                </div>
            </div>)}
            {isSmallScreen && (<div className="time-menu-btn" style={buttonStyle} onClick={e => handleClick(e)}>
                {!isVerySmallScreen ? (
                    <>
                        {isCorrectNetwork(providerChainID) && <img src={imgSource} width="25" />}
                        {isCorrectNetwork(providerChainID) && <>&nbsp;</>}
                        <p>{buttonText}</p>
                    </>
                ) : (
                    <img src={imgSource} width="25" />
                )}
            </div>)}
            <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition onMouseLeave={e => handleClick(e)}>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <div className="add-tokens">
                                {chainName() != "Avalanche" ? (
                                    <div className="tooltip-item" onClick={changeNetworkAVAX}>
                                        <img src={AvaxIcon} width="25" />
                                        <p>&nbsp;Avalanche</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {chainName() != "BSC" ? (
                                    <div className="tooltip-item" onClick={changeNetworkBSC}>
                                        <img src={BSCIcon} width="25" />
                                        <p>&nbsp;BSC</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {chainName() != "Cronos" ? (
                                    <div className="tooltip-item" onClick={changeNetworkCRO}>
                                        <img src={CroIcon} width="25" />
                                        <p>&nbsp;Cronos</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {chainName() != "Fantom" ? (
                                    <div className="tooltip-item" onClick={changeNetworkFTM}>
                                        <img src={FtmIcon} width="25" />
                                        <p>&nbsp;Fantom</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {chainName() != "Moonriver" ? (
                                    <div className="tooltip-item" onClick={changeNetworkMOVR}>
                                        <img src={MovrIcon} width="25" />
                                        <p>&nbsp;Moonriver</p>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default SwitchButton;
