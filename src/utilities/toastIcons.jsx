// The icons every notification draws from, in one place so a toast never has
// to invent its own and the same action never gets two different marks in two
// different pages.
//
// Rounded, filled MUI icons on purpose: an outline mark reads as tentative at
// 20px on a dark ground, and a notification is a statement of what happened,
// not a suggestion. Sized with the same `!text-[20px]` the rest of the app uses
// on MUI icons.
//
// Colour is deliberately absent here. Sonner draws icons with currentColor, so
// each icon takes the colour its toast already sets in App.jsx — Off White by
// default, Brand Red on an error. Setting a colour on the icon itself would
// break that and put a hardcoded hex in a component.
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import WarningRounded from '@mui/icons-material/WarningRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ShoppingCartRounded from '@mui/icons-material/ShoppingCartRounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import AutorenewRounded from '@mui/icons-material/AutorenewRounded';

const size = '!text-[20px]';

// Replaces sonner's own defaults for every toast that does not name an icon.
export const TOASTER_ICONS = {
    success: <CheckCircleRounded className={size} />,
    error: <ErrorRounded className={size} />,
    warning: <WarningRounded className={size} />,
    info: <InfoRounded className={size} />,
    close: <CloseRounded className="!text-[16px]" />,
};

// Passed per call, as `toast.success(message, { icon: TOAST_ICONS.deleted })`,
// where the default tick would be misleading or simply say less than it could.
//
// `deleted` is the clearest case: seven admin messages confirm a deletion, and
// a green-reading tick says "saved" for something that was in fact removed.
export const TOAST_ICONS = {
    cart: <ShoppingCartRounded className={size} />,
    deleted: <DeleteRounded className={size} />,
    statusChanged: <AutorenewRounded className={size} />,
};
