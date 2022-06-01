import { SvgIcon, Link } from "@material-ui/core";
import BscscanIcon from "../../../assets/icons/bscscan.svg";
import TwitterIcon from "../../../assets/icons/twitter.svg";
import TelegramIcon from "../../../assets/icons/telegram.svg";
import DiscordIcon from "../../../assets/icons/discord.svg";
import AuditIcon from "../../../assets/icons/audit.svg"

export default function Social() {
    return (
        <div className="social-row">
            <div className="footer-item" >
                <a href="https://testnet.bscscan.com/" target="_blank">
                    <img src={BscscanIcon} alt="Contract on Bscscan" />
                </a>
            </div>
            <div className="footer-item" >
                <a href="https://" target="_blank">
                    <img src={AuditIcon} alt="Contract Audit" />
                </a>
            </div>
            <div className="footer-item" >
                <a href="https://t.me/" target="_blank">
                    <img src={TelegramIcon} alt="Telegram" />
                </a>
            </div>
            <div className="footer-item" >
                <a href="https://twitter.com/" target="_blank">
                    <img src={TwitterIcon} alt="Twitter" />
                </a>
            </div>
            {/* <div className="footer-item" >
                <a href="https://discord.gg/" target="_blank">
                    <img src={DiscordIcon} alt="Discord" />
                </a>
            </div> */}
        </div>
    );
}
