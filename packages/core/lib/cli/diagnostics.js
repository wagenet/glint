export function buildDiagnosticFormatter(ts) {
    const formatDiagnosticHost = {
        getCanonicalFileName: (name) => name,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
    };
    return (diagnostic) => ts.formatDiagnosticsWithColorAndContext([diagnostic], formatDiagnosticHost);
}
//# sourceMappingURL=diagnostics.js.map