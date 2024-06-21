/**
 * Handler for unwrap fails.
 */
export namespace UnwrapHandler {
    export let hook: (error_message: string) => void = () => {};
}


/**
 * Will unwrap the value removing a potential null.
 *
 * If this fails the unwrap hook will be called (if set).
 */
export function unwrap<T>(value: T|null, error_message: string): T {
    if (value === null) {
        UnwrapHandler.hook(error_message);
        throw new Error(error_message);
    }
    return value;
}


/**
 * This function will set the unwrap hook.
 *
 * Unwrap hook will be called when some unwrap fails.
 */
export function set_unwrap_hook(input_hook: (error_message: string) => void) {
    UnwrapHandler.hook = input_hook;
}


/**
 * Calls the unwrap hook with the given `error_message` and throws a generic `Error` with the given `error_message`.
 *
 * @param {string} error_message The error message to call the hook with and throw
 */
export function call_unwrap_hook(error_message: string): void {
    UnwrapHandler.hook(error_message);
    throw new Error(error_message);
}
