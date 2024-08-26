
export const AdSenseAd: React.FC<{dataAdSlot: string}> = ({dataAdSlot}) => {

    return window.adsbygoogle && window.location.hostname === "archiveofbabel" && (
        <div className="text-center adsbygoogle mt-2">
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-4658165198708977"
                data-ad-slot={dataAdSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            >
            </ins>
        </div>
    );
};