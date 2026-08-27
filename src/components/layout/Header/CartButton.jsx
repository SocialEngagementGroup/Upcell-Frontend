import { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { CartContext } from '../../../App';

// The cart is the one action that never collapses into the drawer: it is the
// end of the funnel and has to be reachable from every width.
const CartButton = () => {
    const { cart } = useContext(CartContext);
    const count = Array.isArray(cart) ? cart.length : 0;
    const label = count === 1 ? 'Cart, 1 item' : `Cart, ${count} items`;

    return (
        <Link
            to="/cart"
            aria-label={label}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-apple-text outline-none transition-colors duration-200 ease-smooth hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white [&_svg]:!text-[22px]"
        >
            <ShoppingCartOutlinedIcon aria-hidden="true" />
            {count > 0 && (
                <span
                    aria-hidden="true"
                    className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold leading-none text-white"
                >
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Link>
    );
};

export default CartButton;
