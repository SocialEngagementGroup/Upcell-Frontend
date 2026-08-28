// A ProductCard-shaped placeholder, shown while the catalogue request is in
// flight.
//
// Every measurement below is taken from a rendered ProductCard rather than
// guessed, because the whole point is that nothing moves when the real cards
// arrive:
//
//     image   180   name 20 (mt-3)   specs 19 (mt-1)
//     rating   21 (mt-2)             price 49 (mt-3)
//     button   44 (mt-3)
//     + p-4 padding (32) + border (2)  =  415
//
// A first attempt used round numbers and came out 41px short per card, which
// showed up as a 165px jump across the page's four rails the moment the data
// landed. If ProductCard's internal spacing changes, these must change with it.
const Line = ({ className }) => (
    <span className={`block rounded bg-black/[0.07] ${className}`} />
);

const ProductCardSkeleton = () => (
    <div
        aria-hidden="true"
        className="flex h-full w-[270px] shrink-0 animate-pulse flex-col rounded-2xl border border-black/[0.06] bg-white p-4 md:w-[285px]"
    >
        <span className="block h-[180px] rounded-xl bg-black/[0.05]" />

        <Line className="mt-3 h-5 w-4/5" />
        <Line className="mt-1 h-[19px] w-3/5" />
        <Line className="mt-2 h-[21px] w-2/5" />
        <Line className="mt-3 h-[49px] w-1/2" />

        <span className="mt-3 block h-11 rounded-lg bg-black/[0.05]" />
    </div>
);

export default ProductCardSkeleton;
