export function debounce(threshold, f) {
    let pending;
    return () => {
        if (pending) {
            clearTimeout(pending);
        }
        pending = setTimeout(f, threshold);
    };
}
//# sourceMappingURL=scheduling.js.map