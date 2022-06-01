import { useState } from "react";
import { AppBar, Box, Modal, Toolbar, useMediaQuery } from "@material-ui/core";
import LogoIcon from "../../../assets/icons/bnbpark-logo.png";
import Social from "./social";
import "./drawer-content.scss";

const styleSmall = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '70%',
    bgcolor: '#272F3D',
    borderRadius: '12px',
    boxShadow: 24,
    color: 'white',
    p: 3,
};

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: '#272F3D',
    borderRadius: '12px',
    boxShadow: 24,
    color: 'white',
    p: 3,
};

function NavContent() {
    const [open, setOpen] = useState(false);
    const isSmallScreen = useMediaQuery("(max-width: 500px)");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="dapp-sidebar">
            <div className="drawer-logo-wrap">
                <img src={LogoIcon} width={100} />
            </div>

            {/* <div className="drawer-menu-items">
                <p className="menu-item" onClick={handleOpen}>
                    Disclaimer
                </p>
                <a className="menu-item" href="https://" target="_blank">
                    About
                </a>
                <a className="menu-item" href="https://" target="_blank">
                    Whitepaper
                </a>
                <a className="menu-item" href="https://" target="_blank">
                    Roadmap
                </a>
                <a className="menu-item" href="https://" target="_blank">
                    Audit
                </a>
                <a className="menu-item" href="https://" target="_blank">
                    Team
                </a>
                <a className="menu-item" href="https://" target="_blank">
                    FAQ
                </a>
                <a className="menu-item" href="https://" target="_blank">
                    Safety Rules
                </a>
                <a className="menu-item" href="mailto:info@yieldore.com">
                    Business Inquiries
                </a>
            </div> */}
            <Social />
        </div>
    );
}

export default NavContent;
