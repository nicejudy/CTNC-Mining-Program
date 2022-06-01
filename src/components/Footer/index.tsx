import React, { useMemo, useEffect, useState } from "react";
import TelegramIcon from "../../assets/icons/telegram.svg";
import TwitterIcon from "../../assets/icons/twitter.svg";
import DiscordIcon from "../../assets/icons/discord.svg";
import BscscanIcon from "../../assets/icons/bscscan.svg";
import AuditIcon from "../../assets/icons/audit.svg";
import { useWeb3Context } from "src/hooks";
import "./footer.scss";

function Footer() {
    const { providerChainID, connected, address } = useWeb3Context();

    const [explorer, setExplorer] = useState("https://bscscan.com/address/0xA3b67B202495ff851eD85bF64B9e96ADcf9e5fA7");

    useEffect(() => {
        if (providerChainID == 56) setExplorer("https://bscscan.com/address/0xA3b67B202495ff851eD85bF64B9e96ADcf9e5fA7");
        if (providerChainID == 43114) setExplorer("https://snowtrace.io/address/0xA3b67B202495ff851eD85bF64B9e96ADcf9e5fA7");
        if (providerChainID == 250) setExplorer("https://ftmscan.com/address/0xA3b67B202495ff851eD85bF64B9e96ADcf9e5fA7");
        if (providerChainID == 25) setExplorer("https://cronoscan.com/address/0xA3b67B202495ff851eD85bF64B9e96ADcf9e5fA7");
        if (providerChainID == 1285) setExplorer("https://moonriver.moonscan.io/address/0xA3b67B202495ff851eD85bF64B9e96ADcf9e5fA7");
    }, [providerChainID]);

    return (
        <div className="dapp-footer">
            <div className="footer-content">
                <div className="footer-items-wrap">
                    <div className="footer-item" >
                        <a href={explorer} target="_blank">
                            <img src={BscscanIcon} alt="Contract on Bscscan" />
                        </a>
                    </div>
                    {/* <div className="footer-item" >
                        <a href="https://testnet.bscscan.com/" target="_blank">
                            <img src={AuditIcon} alt="Contract Audit" />
                        </a>
                    </div> */}
                    <div className="footer-item" >
                        <a href="https://t.me/KRONOS_community" target="_blank">
                            <img src={TelegramIcon} alt="Telegram" />
                        </a>
                    </div>
                    <div className="footer-item" >
                        <a href="https://twitter.com/dao_kronos" target="_blank">
                            <img src={TwitterIcon} alt="Twitter" />
                        </a>
                    </div>
                    {/* <div className="footer-item" >
                        <a href="https://discord.gg/" target="_blank">
                            <img src={DiscordIcon} alt="Discord" />
                        </a>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Footer;
