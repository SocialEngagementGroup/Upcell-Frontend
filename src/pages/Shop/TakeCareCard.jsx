import { useRef, useState } from 'react';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import { STATIC_IMAGES, staticImageUrl } from '../../constants/staticImages';

// "Take care of your tech" — the reference's video block: heading on the left,
// a single portrait video centred under it with a play control over the poster.
//
// UpCell has no footage yet, so VIDEO_SRC is empty. The card is built around a
// real <video> anyway rather than faking one, so supplying a file is the only
// change needed: drop a URL in below and the button plays it inline.
//
// While the source is empty the button still renders — it is the design — but
// it is marked aria-disabled and titled, so a screen reader and a hover both
// say the video is not there yet instead of the control silently doing nothing.
const VIDEO_SRC = '';
const POSTER = STATIC_IMAGES.BLOG_TRADE_IN_TIMING;

const TakeCareCard = () => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const play = () => {
        if (!VIDEO_SRC) return;
        videoRef.current?.play();
        setPlaying(true);
    };

    return (
        <section aria-labelledby="take-care-heading" className="py-8 md:py-10">
            <div className="site-shell">
                <h2 id="take-care-heading" className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-apple-text md:text-[1.75rem]">
                    Take care of your tech
                </h2>

                <div className="mt-6 flex justify-center">
                    {/* Portrait, as the reference has it — the aspect ratio
                        holds the box before the poster has decoded, so the
                        section does not jump on load. */}
                    <div className="relative aspect-[9/16] w-[255px] overflow-hidden rounded-2xl bg-apple-text md:w-[280px]">
                        <video
                            ref={videoRef}
                            src={VIDEO_SRC || undefined}
                            poster={staticImageUrl(POSTER, 700)}
                            controls={playing}
                            playsInline
                            preload="none"
                            onEnded={() => setPlaying(false)}
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        {!playing && (
                            <button
                                type="button"
                                onClick={play}
                                aria-disabled={!VIDEO_SRC}
                                title={VIDEO_SRC ? undefined : 'Video coming soon'}
                                aria-label={VIDEO_SRC ? 'Play video' : 'Video coming soon'}
                                className="absolute inset-0 flex items-center justify-center bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-inset"
                            >
                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-surface transition-transform duration-200 ease-smooth hover:scale-105 [&_svg]:!text-[34px]">
                                    <PlayArrowRoundedIcon aria-hidden="true" className="ml-0.5 text-apple-text" />
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TakeCareCard;
