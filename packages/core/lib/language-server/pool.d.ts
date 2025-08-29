import { Connection, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import GlintLanguageServer from './glint-language-server.js';
export declare type ServerDetails = {
    server: GlintLanguageServer;
    rootDir: string;
    scheduleDiagnostics: () => void;
};
export declare class LanguageServerPool {
    private connection;
    private openDocuments;
    private servers;
    private configLoader;
    constructor(connection: Connection, openDocuments: TextDocuments<TextDocument>);
    forEachServer<T>(callback: (details: ServerDetails) => T): void;
    withServerForURI<T>(uri: string, callback: (details: ServerDetails) => T): T | undefined;
    private runWithCapturedErrors;
    private configForURI;
    private getServerDetailsForURI;
    private launchServer;
    private buildDiagnosticScheduler;
    private sendMessage;
}
