export function sysForCompilerHost(ts, transformManagerOrPool) {
    return {
        ...ts.sys,
        readDirectory: transformManagerOrPool.readDirectory,
        watchDirectory: transformManagerOrPool.watchDirectory,
        fileExists: transformManagerOrPool.fileExists,
        watchFile: transformManagerOrPool.watchTransformedFile,
        readFile: transformManagerOrPool.readTransformedFile,
        getModifiedTime: transformManagerOrPool.getModifiedTime,
    };
}
//# sourceMappingURL=sys-for-compiler-host.js.map