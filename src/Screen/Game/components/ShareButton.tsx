import { Share1Icon } from "@radix-ui/react-icons";
import { Paperclip } from "lucide-react";
import ReactGA from "react-ga4";
import {
    FacebookIcon,
    FacebookShareButton,
    EmailShareButton,
    EmailIcon,
    LinkedinShareButton,
    LinkedinIcon,
    RedditShareButton,
    RedditIcon,
    TelegramShareButton,
    TelegramIcon,
    TumblrIcon,
    TumblrShareButton,
    TwitterShareButton,
    TwitterIcon,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";

export const ShareButton = () => {
    const url = window.location.href;
    
    const shareClick = (platform: string) => {
        ReactGA.send({
            hitType: "share",
            platform
          });
    }

    const copyUrlToClipboard = () => {
        navigator.clipboard.writeText(url)
            .then(() => {
                shareClick('copy')
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };
    
    return (
        <div className="dropdown dropdown-top dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1 btn-primary">
                <div className="flex gap-x-2">
                    <Share1Icon />
                    <span>Share</span>
                </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] p-2 shadow gap-y-2">
                <li>
                    <button onClick={copyUrlToClipboard} className="min-w-8 min-h-8 max-h-8 max-h-8 btn bg-gray-400 rounded-full border-none p-0 w-0 flex justify-center items-center">
                        <Paperclip color="white" size={18}/> {/* Adjust size to ensure visibility */}
                    </button>
                </li>
                <li>
                    <EmailShareButton onClick={() => shareClick('email')} url={url} subject="Check out this cool page I found on Archive of Babel!">
                        <EmailIcon size={32} round={true} />
                    </EmailShareButton>
                </li>
                <li>
                    <FacebookShareButton onClick={() => shareClick('facebook')} url={url}>
                        <FacebookIcon size={32} round={true} />
                    </FacebookShareButton>
                </li>
                <li>
                    <LinkedinShareButton
                         onClick={() => shareClick('linkedin')}
                        url={url}
                        title="I Found this on the Archive of Babel"
                        summary="The Archive of Babel is a digital representation of the library of babel, where, theoretically, every book in existence can be found." source="https://www.archiveofbabel.com">
                        <LinkedinIcon size={32} round={true} />
                    </LinkedinShareButton>
                </li>
                <li>
                    <RedditShareButton
                         onClick={() => shareClick('reddit')}
                        title="A Page From The Archive of Babel"
                        url={url}>
                        <RedditIcon size={32} round={true} />
                    </RedditShareButton>
                </li>
                <li>
                    <TelegramShareButton
                         onClick={() => shareClick('telegram')}
                        title="A Page From The Archive of Babel"
                        url={url}>
                        <TelegramIcon size={32} round={true} />
                    </TelegramShareButton>
                </li>
                <li>
                    <TumblrShareButton
                        onClick={() => shareClick('tumblr')}
                        title="A Page From The Archive of Babel"
                        caption="The Archive of Babel is a digital representation of the library of babel, where, theoretically, every book in existence can be found."
                        url={url}>
                        <TumblrIcon size={32} round={true} />
                    </TumblrShareButton>
                </li>
                <li>
                    <TwitterShareButton
                         onClick={() => shareClick('twitter')}
                        title="A Page From The Archive of Babel"
                        hashtags={['archiveofbabel','programming','browsergames']}
                        url={url}>
                        <TwitterIcon size={32} round={true} />
                    </TwitterShareButton>
                </li>
                <li>
                    <WhatsappShareButton
                         onClick={() => shareClick('whatsapp')}
                        title="A Page From The Archive of Babel"
                        url={url}>
                        <WhatsappIcon size={32} round={true} />
                    </WhatsappShareButton>
                </li>
            </ul>
        </div>
    );
};
