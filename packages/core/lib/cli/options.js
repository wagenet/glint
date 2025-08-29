export function determineOptionsToExtend(argv) {
    let options = {};
    if ('incremental' in argv) {
        options.incremental = argv.incremental;
    }
    if ('watch' in argv) {
        options['preserveWatchOutput'] = argv['preserveWatchOutput'];
    }
    if ('declaration' in argv) {
        options.noEmit = !argv.declaration;
        options.declaration = Boolean(argv.declaration);
        options.emitDeclarationOnly = Boolean(argv.declaration);
    }
    else if ('build' in argv) {
        options.noEmit = false;
        options.declaration = true;
        options.emitDeclarationOnly = true;
    }
    else {
        options.noEmit = true;
        options.declaration = false;
        options.declarationMap = false;
    }
    return options;
}
//# sourceMappingURL=options.js.map