import { Adsense } from '@ctrl/react-adsense';

export const AdSenseAd: React.FC<{dataAdSlot: string}> = ({dataAdSlot}) => {

    return window.adsbygoogle && (
        <div className="text-center mt-2">
            <Adsense
                className='ExampleAdSlot'
                client="ca-pub-4658165198708977"
                slot={dataAdSlot}
                adTest={window.location.hostname === "archiveofbabel" ? '' : 'on'}
            />
        </div>
    );
};