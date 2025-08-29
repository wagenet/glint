export function assert(test, message = 'Internal error') {
    if (test == null || test === false) {
        throw new Error(message);
    }
}
//# sourceMappingURL=assert.js.map