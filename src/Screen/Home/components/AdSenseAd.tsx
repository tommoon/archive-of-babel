import { Adsense } from '@ctrl/react-adsense';

export const AdSenseAd: React.FC<{dataAdSlot: string, extraProps?:any}> = ({dataAdSlot, extraProps}) => {
    return window.adsbygoogle && (
        <div className="text-center w-full px-5">
            <Adsense
                style={{
   ...extraProps,
                    display: 'block'
                }}
                className='ExampleAdSlot'
                client="ca-pub-4658165198708977"
                slot={dataAdSlot}
                adTest={window.location.hostname === "archiveofbabel" ? '' : 'on'}
            />
        </div>
    );
};