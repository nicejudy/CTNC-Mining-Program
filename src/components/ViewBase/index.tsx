import React, { useState, useEffect } from "react";
import "./view-base.scss";
import Header from "../Header";
import { Hidden, makeStyles, useMediaQuery } from "@material-ui/core";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";
import MobileDrawer from "../Drawer/mobile-drawer";
import { useWeb3Context } from "src/hooks";
import Messages from "../Messages";
import Footer from "../Footer";

interface IViewBaseProps {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
        overflow: "auto",
    },
    content: {
        padding: theme.spacing(1),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        height: "100%",
        paddingTop: 0,
        overflow: "auto",
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function ViewBase({ children }: IViewBaseProps) {
    const classes = useStyles();
    // const { provider, address, providerChainID, checkWrongNetwork } = useWeb3Context();

    const [mobileOpen, setMobileOpen] = useState(false);

    const isSmallerScreen = useMediaQuery("(max-width: 1024px)");
    const isSmallScreen = useMediaQuery("(max-width: 600px)");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // useEffect(() => {
    //     const root = document.documentElement;

    //     if (providerChainID == 56) {
    //         root?.style.setProperty("--bg-color", "#2c2a00");
    //     };
    //     if (providerChainID == 43114) {
    //         root?.style.setProperty("--bg-color", "#240c0c");
    //     }
    //     if (providerChainID == 250) {
    //         root?.style.setProperty("--bg-color", "#00222e");
    //     }
    //     if (providerChainID == 25) {
    //         root?.style.setProperty("--bg-color", "#171a25");
    //     }
    //     if (providerChainID == 1285) {
    //         root?.style.setProperty("--bg-color", "#172e2d");
    //     }
    // }, [providerChainID]);

    return (
        <div className="view-base-root">
            <Messages />
            <Header drawe={!isSmallerScreen} handleDrawerToggle={handleDrawerToggle} />
            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
                {children}
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default ViewBase;
