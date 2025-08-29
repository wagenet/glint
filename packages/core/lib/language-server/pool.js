import { ConfigLoader } from '../config/index.js';
import { MessageType, ShowMessageNotification, DiagnosticSeverity, } from 'vscode-languageserver';
import DocumentCache from '../common/document-cache.js';
import { debounce } from '../common/scheduling.js';
import TransformManager from '../common/transform-manager.js';
import GlintLanguageServer from './glint-language-server.js';
import { uriToFilePath } from './util/index.js';
import { validateTS } from '../common/typescript-compatibility.js';
export class LanguageServerPool {
    constructor(connection, openDocuments) {
        this.connection = connection;
        this.openDocuments = openDocuments;
        this.servers = new Map();
        this.configLoader = new ConfigLoader();
    }
    forEachServer(callback) {
        for (let details of this.servers.values()) {
            if (details) {
                this.runWithCapturedErrors(callback, details);
            }
        }
    }
    withServerForURI(uri, callback) {
        let details = this.getServerDetailsForURI(uri);
        if (details) {
            return this.runWithCapturedErrors(callback, details);
        }
    }
    runWithCapturedErrors(callback, details) {
        try {
            return callback(details);
        }
        catch (error) {
            this.connection.console.error(errorMessage(error));
        }
    }
    configForURI(uri) {
        return this.configLoader.configForFile(uriToFilePath(uri));
    }
    getServerDetailsForURI(uri) {
        try {
            let config = this.configForURI(uri);
            if (!config)
                return;
            if (this.servers.has(config)) {
                return this.servers.get(config);
            }
            let details = this.launchServer(config);
            this.servers.set(config, details);
            return details;
        }
        catch (error) {
            this.sendMessage(MessageType.Error, `Unable to start Glint language service for ${uriToFilePath(uri)}.\n${errorMessage(error)}`);
        }
    }
    launchServer(glintConfig) {
        let tsValidationResult = validateTS(glintConfig.ts);
        if (!tsValidationResult.valid) {
            this.sendMessage(MessageType.Warning, `Not launching Glint for this directory: ${tsValidationResult.reason}`);
            return;
        }
        let documentCache = new DocumentCache(glintConfig);
        let transformManager = new TransformManager(glintConfig, documentCache);
        let rootDir = glintConfig.rootDir;
        let server = new GlintLanguageServer(glintConfig, documentCache, transformManager);
        let scheduleDiagnostics = this.buildDiagnosticScheduler(server, glintConfig);
        return { server, rootDir, scheduleDiagnostics };
    }
    buildDiagnosticScheduler(server, glintConfig) {
        return debounce(250, () => {
            let documentsForServer = this.openDocuments
                .all()
                .filter((doc) => this.configForURI(doc.uri) === glintConfig);
            for (let { uri } of documentsForServer) {
                try {
                    const diagnostics = server.getDiagnostics(uri);
                    this.connection.sendDiagnostics({ uri, diagnostics });
                }
                catch (error) {
                    this.connection.sendDiagnostics({
                        uri,
                        diagnostics: [
                            {
                                severity: DiagnosticSeverity.Error,
                                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
                                message: 'Glint encountered an error computing diagnostics for this file. ' +
                                    'This is likely a bug in Glint; please file an issue, including any ' +
                                    'code and/or steps to follow to reproduce the error.\n\n' +
                                    errorMessage(error),
                            },
                        ],
                    });
                    this.connection.console.error(`Error getting diagnostics for ${uri}.\n${errorMessage(error)}`);
                }
            }
        });
    }
    sendMessage(type, message) {
        this.connection.sendNotification(ShowMessageNotification.type, { message, type });
    }
}
function errorMessage(error) {
    return (error instanceof Error && error.stack) || `${error}`;
}
//# sourceMappingURL=pool.js.map