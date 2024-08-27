import { Adsense } from '@ctrl/react-adsense';

export const AdSenseAd: React.FC<{ dataAdSlot: string, dataAdLayoutKey: string }> = ({dataAdSlot, dataAdLayoutKey}) => {
    return window.adsbygoogle && (
        <div className="text-center w-full max-w-full max-h-[50vh] px-5">
            <Adsense
                style={{
                    display: 'block'
                }}
                client="ca-pub-4658165198708977"
                slot={dataAdSlot}
                layoutKey={dataAdLayoutKey}
                format='fluid'
                adTest={window.location.hostname === "archiveofbabel" ? '' : 'on'}
            />
        </div>
    );
};