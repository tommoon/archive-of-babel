import { useEffect } from "react";

export const BuyMeACoffee = () => {
    useEffect(() => {
        let script = document.createElement("script");
        script.setAttribute('data-name', 'BMC-Widget');
        script.src = "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js";
        script.setAttribute('data-id', 'twombles');
        script.setAttribute('data-description', 'Thank you for your support!');
        script.setAttribute('data-message', 'The archive is free to use. Do you want to help by supporting it?');
        script.setAttribute('data-color', "#dca54c");
        script.setAttribute('data-position', 'right');
        script.setAttribute('data-x_margin', '18');
        script.setAttribute('data-y-margin', '18');
        script.async = true;

        // Call window on load to show the image
        script.onload = function () {
            const event = new Event('DOMContentLoaded');
            window.dispatchEvent(event);

            // Move the widget button into the #bmc-container
            const bmcButton = document.getElementById("bmc-wbtn");
            if (bmcButton) {
                const bmcContainer = document.getElementById("bmc-container");
                if (bmcContainer) {
                    bmcContainer.appendChild(bmcButton);
                    bmcButton.style.position = 'static';
                }
            }
        };

        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
            const widget = document.getElementById("bmc-wbtn");
            if (widget && widget.parentNode) {
                widget.parentNode.removeChild(widget);
            }
        };
    }, []);

    return (
        <div id="bmc-container"></div>
    );
};
