import * as path from 'node:path';
import { GlintEnvironment } from './environment.js';
/**
 * This class represents parsed Glint configuration from a `tsconfig` or `jsconfig` file,
 * with methods for interrogating project configuration based on its contents.
 */
export class GlintConfig {
    constructor(ts, configPath, config) {
        Object.defineProperty(this, 'ts', { value: ts });
        this.configPath = normalizePath(configPath);
        this.rootDir = path.dirname(configPath);
        this.environment = GlintEnvironment.load(config.environment, { rootDir: this.rootDir });
        this.checkStandaloneTemplates = config.checkStandaloneTemplates ?? true;
        this.extensions = this.environment.getConfiguredFileExtensions();
    }
    /**
     * Indicates whether this configuration object applies to the file at the
     * given path.
     */
    includesFile(rawFileName) {
        return this.extensions.some((ext) => rawFileName.endsWith(ext));
    }
    // Given the path of a template or script (potentially with a custom extension),
    // returns the corresponding .js or .ts path we present to the TS language service.
    getSynthesizedScriptPathForTS(filename) {
        let extension = path.extname(filename);
        let filenameWithoutExtension = filename.slice(0, filename.lastIndexOf(extension));
        switch (this.environment.getSourceKind(filename)) {
            case 'template':
                return `${filenameWithoutExtension}${this.checkStandaloneTemplates ? '.ts' : '.js'}`;
            case 'typed-script':
                return `${filenameWithoutExtension}.ts`;
            case 'untyped-script':
                return `${filenameWithoutExtension}.js`;
            default:
                return filename;
        }
    }
    /**
     * Parses and returns the TypeScript configuration for this project.
     * Results are cached after the first call.
     */
    getParsedTsConfig() {
        if (!this.parsedTsConfig) {
            const contents = this.ts.readConfigFile(this.configPath, this.ts.sys.readFile).config;
            const host = { ...this.ts.sys };
            this.parsedTsConfig = this.ts.parseJsonConfigFileContent(contents, host, this.rootDir, undefined, this.configPath);
        }
        return this.parsedTsConfig;
    }
    /**
     * Returns the TypeScript compiler options for this project.
     */
    getCompilerOptions() {
        return this.getParsedTsConfig().options;
    }
}
export function normalizePath(fileName) {
    if (path.sep !== '/') {
        return fileName.split(path.sep).join('/');
    }
    return fileName;
}
//# sourceMappingURL=config.js.map