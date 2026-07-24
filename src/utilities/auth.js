export const normalizeRole = (role) => {
    if (typeof role !== "string") return null;
    return role.trim().toLowerCase();
};

export const normalizeEmail = (email) => (
    typeof email === "string" ? email.trim().toLowerCase() : ""
);

export const getClerkPrimaryEmail = (clerkUser) => (
    clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || ""
);

// Clerk's publicMetadata.role is the single source of truth for admin
// status, on both frontend and backend (see Backend/src/middleware/auth.middleware.js)
// — no separate hardcoded email allowlist here, so there's only one place
// that ever needs updating to grant/revoke admin access.
export const getUserRole = (clerkUser) => normalizeRole(clerkUser?.publicMetadata?.role) || "customer";
