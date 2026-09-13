import { describe, it, expect } from 'vitest';
import { mergeCarts } from './cartMerge';

// Signing in must never take something out of the cart somebody is looking at,
// and must never quietly double it either.
describe('merging a browser cart with a saved one', () => {
  it('brings over a cart left on another device', () => {
    expect(mergeCarts([], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('keeps what is in front of the customer when nothing was saved', () => {
    expect(mergeCarts(['a'], [])).toEqual(['a']);
  });

  it('adds only what the local cart has never heard of', () => {
    expect(mergeCarts(['a'], ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('puts the local cart first, so nothing already on screen moves', () => {
    // The cart page removes a line by its position. Reordering the local part
    // would take away the wrong thing.
    expect(mergeCarts(['b'], ['a'])).toEqual(['b', 'a']);
  });

  it('does not multiply a quantity the customer chose', () => {
    // Two of the same case is two cases. Signing in must not make it four.
    expect(mergeCarts(['a', 'a'], ['a'])).toEqual(['a', 'a']);
  });

  it('leaves local duplicates alone rather than tidying them up', () => {
    expect(mergeCarts(['a', 'b', 'a'], [])).toEqual(['a', 'b', 'a']);
  });

  it('does not carry a duplicate across from the saved cart', () => {
    // The saved side is somebody else's screen; its quantities have already
    // lost to the local ones.
    expect(mergeCarts(['a'], ['a', 'a', 'b'])).toEqual(['a', 'b']);
  });

  it('is empty only when both sides are', () => {
    expect(mergeCarts([], [])).toEqual([]);
  });
});
