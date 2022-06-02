import { useEffect, useState } from "react";
import { AppBar, Box, Modal, Toolbar } from "@material-ui/core";
import { useWeb3Context } from "../../hooks";
import { makeStyles, rgbToHex } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ConnectButton from "./connect-button";
import MenuIcon from "../../assets/icons/hamburger.svg";
import LogoIcon from "../../assets/icons/bnbpark-logo.png";
import "./header.scss";
import { TRANSITION_DURATION } from "../../constants/style";

interface IHeader {
    handleDrawerToggle: () => void;
    drawe: boolean;
}

const style = {
    // position: 'absolute' as 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: '#272F3D',
    borderRadius: '12px',
    boxShadow: 24,
    color: 'white',
    p: 4,
};

const useStyles = makeStyles(theme => ({
    appBar: {
        padding: "20px 0 20px 0",
        [theme.breakpoints.up("sm")]: {
            width: "100%",
            padding: "20px 0 20px 0",
        },
        justifyContent: "flex-end",
        alignItems: "flex-end",
        background: "transparent",
        backdropFilter: "none",
        zIndex: 10,
    },
    topBar: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        position: "fixed",
        width: "100%",
        zIndex: 1,
    },
    topBarShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function Header({ handleDrawerToggle, drawe }: IHeader) {
    const { provider, web3, chainID, providerChainID, connected, address } = useWeb3Context();
    const [isConnected, setConnected] = useState(connected);

    const classes = useStyles();
    const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
            <div className={classes.appBar}>
                <div className="dapp-topbar">
                    {/* <div onClick={handleDrawerToggle} className="dapp-topbar-slider-btn">
                        <img src={MenuIcon} alt="" />
                    </div> */}
                    <div className="dapp-topbar-logo-wrap">
                        <img src={LogoIcon} width={150} />
                    </div>
                    {/* <div className="dapp-topbar-btns-wrap">
                        {isConnected && <SwitchButton />}
                    </div> */}
                    <div className="dapp-topbar-btns-wrap">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
