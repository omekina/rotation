///<reference lib="dom" />
import { unwrap } from "./unwrap";


/**
 * This function is just a wrapper on document query selector.
 * Using this is should not be preferred over `document.querySelector(selector)` but can be used to strip this bit of boilerplate.
 *
 * This function additionally checks if the result is null and will panic (using `unwrap`) if it is null.
 *
 * WARNING: This function DOES NOT check that the retrieved element is indeed of type T.
 *
 * @param {string} selector - Will be passed to the `document.querySelector` call.
 */
export default function req_el<T>(selector: string): T {
    return unwrap(<T|null> document.querySelector(selector), "Could not retrieve DOM element with selector \"" + selector + "\".");
}
