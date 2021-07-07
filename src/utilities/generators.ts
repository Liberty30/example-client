import { HexString } from "./types"

export const randInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Generate a randomized hex string of a specific length prefixed by `0x`
 * @param length The length of the hex string excluding the prefix
 */
export const generateHexString = (length: number): HexString => {
  return "0x" + [...Array(length)].map(() => randInt(16).toString(16)).join("");
};
