export const ADMIN_EMAILS = ["globaltradersww2@gmail.com"];

export const normalizeRole = (role) => {
    if (typeof role !== "string") return null;
    return role.trim().toLowerCase();
};

export const normalizeEmail = (email) => (
    typeof email === "string" ? email.trim().toLowerCase() : ""
);

export const isAdminEmail = (email) => ADMIN_EMAILS.includes(normalizeEmail(email));

export const getClerkPrimaryEmail = (clerkUser) => (
    clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || ""
);

export const getUserRole = (clerkUser) => {
    const email = getClerkPrimaryEmail(clerkUser);
    return normalizeRole(clerkUser?.publicMetadata?.role) || (isAdminEmail(email) ? "admin" : "customer");
};
