import { describe, it, expect } from 'vitest';
import { normalizeRole, normalizeEmail, getClerkPrimaryEmail, getUserRole } from './auth';

// These four decide who counts as an admin and which email an order belongs to.
// The backend makes the same call independently in
// Backend/src/middleware/auth.middleware.js — if the two ever disagree about
// what "Admin " or "ADMIN" means, the UI shows admin controls to somebody the
// API will refuse, or hides them from somebody it would allow.
describe('normalizeRole', () => {
    it.each([
        ['admin', 'admin'],
        ['ADMIN', 'admin'],
        ['  Admin  ', 'admin'],
    ])('reads %o as %o, so casing and stray spaces cannot grant or deny access', (input, expected) => {
        expect(normalizeRole(input)).toBe(expected);
    });

    // publicMetadata is free-form and set by hand in the Clerk dashboard, so a
    // number or an object can genuinely arrive here.
    it.each([null, undefined, 42, {}, []])('returns null for %o rather than throwing', (input) => {
        expect(normalizeRole(input)).toBeNull();
    });
});

describe('normalizeEmail', () => {
    it('lowercases and trims, so the same address always matches itself', () => {
        expect(normalizeEmail('  Buyer@Example.COM ')).toBe('buyer@example.com');
    });

    // Order ownership is checked by comparing emails. An empty string fails
    // that comparison; undefined would make it throw.
    it.each([null, undefined, 42])('returns an empty string for %o, never undefined', (input) => {
        expect(normalizeEmail(input)).toBe('');
    });
});

describe('getClerkPrimaryEmail', () => {
    it('prefers the primary address', () => {
        const clerkUser = {
            primaryEmailAddress: { emailAddress: 'primary@example.com' },
            emailAddresses: [{ emailAddress: 'other@example.com' }],
        };

        expect(getClerkPrimaryEmail(clerkUser)).toBe('primary@example.com');
    });

    // Clerk populates emailAddresses before primaryEmailAddress on some sign-up
    // paths, so the first address is the fallback rather than nothing.
    it('falls back to the first address when no primary is set yet', () => {
        const clerkUser = { emailAddresses: [{ emailAddress: 'first@example.com' }] };

        expect(getClerkPrimaryEmail(clerkUser)).toBe('first@example.com');
    });

    it.each([null, undefined, {}, { emailAddresses: [] }])(
        'returns an empty string for %o instead of throwing',
        (clerkUser) => {
            expect(getClerkPrimaryEmail(clerkUser)).toBe('');
        }
    );
});

describe('getUserRole', () => {
    it('reads the role from publicMetadata', () => {
        expect(getUserRole({ publicMetadata: { role: 'admin' } })).toBe('admin');
    });

    // The important one. A user with no role set is a customer, never an admin
    // — a signed-out or half-loaded Clerk user must not fall through to
    // anything privileged.
    it.each([
        [null, 'signed out'],
        [{}, 'no metadata'],
        [{ publicMetadata: {} }, 'metadata but no role'],
        [{ publicMetadata: { role: null } }, 'role explicitly null'],
        [{ publicMetadata: { role: 123 } }, 'role is not a string'],
    ])('defaults to customer when %#: %s', (clerkUser) => {
        expect(getUserRole(clerkUser)).toBe('customer');
    });

    it('is not fooled by casing or padding', () => {
        expect(getUserRole({ publicMetadata: { role: '  ADMIN ' } })).toBe('admin');
    });
});
