import * as path from 'node:path';
import { v4 as uuid } from 'uuid';
/**
 * A read-through cache for workspace document contents.
 *
 * Via the Glint configuration it's instantiated with, this cache is aware
 * of two things:
 *   - the relationship between companion script and template files, treating
 *     a change to one member of such pairs as affecting the version of both
 *   - the existence of custom extensions that would result in multiple
 *     potential on-disk paths corresponding to a single logical TS module,
 *     where one path must win out.
 */
export default class DocumentCache {
    constructor(glintConfig) {
        this.glintConfig = glintConfig;
        this.documents = new Map();
        this.ts = glintConfig.ts;
    }
    getDocumentID(path) {
        return this.getDocument(path).id;
    }
    getCanonicalDocumentPath(path) {
        return this.getDocument(path).canonicalPath;
    }
    documentExists(path) {
        // If we have a document that's actually been read from disk, it definitely exists.
        if (this.documents.get(path)?.speculative === false) {
            return true;
        }
        return this.getCandidateDocumentPaths(path).some((candidate) => this.ts.sys.fileExists(candidate));
    }
    getCandidateDocumentPaths(filename) {
        let extension = path.extname(filename);
        let filenameWithoutExtension = filename.slice(0, filename.lastIndexOf(extension));
        return this.getCandidateExtensions(filename).map((ext) => `${filenameWithoutExtension}${ext}`);
    }
    getCompanionDocumentPath(path) {
        let { environment } = this.glintConfig;
        let candidates = environment.isTemplate(path)
            ? environment.getPossibleScriptPaths(path)
            : environment.getPossibleTemplatePaths(path);
        for (let { path, deferTo } of candidates) {
            // If a candidate companion exist and no other module that would claim that
            // companion with a higher priority exists, we've found our winner.
            if (this.documentExists(path) && !deferTo.some((path) => this.documentExists(path))) {
                return path;
            }
        }
        if (environment.isTemplate(path)) {
            return this.glintConfig.getSynthesizedScriptPathForTS(path);
        }
    }
    getDocumentContents(path, encoding) {
        if (!this.documentExists(path))
            return '';
        let document = this.getDocument(path);
        if (document.stale) {
            let onDiskPath = this.getCandidateDocumentPaths(path).find((path) => this.ts.sys.fileExists(path));
            document.stale = false;
            if (onDiskPath) {
                document.contents = this.ts.sys.readFile(onDiskPath, encoding) ?? '';
                document.canonicalPath = onDiskPath;
                document.speculative = false;
            }
            else {
                document.speculative = true;
            }
        }
        return document.contents;
    }
    getCompoundDocumentVersion(path) {
        let env = this.glintConfig.environment;
        let template = env.isTemplate(path) ? this.getDocument(path) : this.findCompanionDocument(path);
        let script = env.isTemplate(path) ? this.findCompanionDocument(path) : this.getDocument(path);
        return `${script?.version}:${template?.version}`;
    }
    getDocumentVersion(path) {
        return this.getDocument(path).version.toString();
    }
    updateDocument(path, contents) {
        let document = this.getDocument(path);
        document.stale = false;
        document.speculative = false;
        document.contents = contents;
        document.canonicalPath = path;
        document.version++;
        this.incrementCompanionVersion(path);
    }
    markDocumentStale(path) {
        let document = this.getDocument(path);
        document.stale = true;
        document.speculative = true;
        document.version++;
        this.incrementCompanionVersion(path);
    }
    removeDocument(path) {
        for (let candidate of this.getCandidateDocumentPaths(path)) {
            this.documents.delete(candidate);
        }
    }
    incrementCompanionVersion(path) {
        let companion = this.findCompanionDocument(path);
        if (companion) {
            companion.version++;
        }
    }
    findCompanionDocument(path) {
        let companionPath = this.getCompanionDocumentPath(path);
        return companionPath ? this.getDocument(companionPath) : undefined;
    }
    getDocument(path) {
        let document = this.documents.get(path);
        if (!document) {
            document = {
                id: uuid(),
                canonicalPath: path,
                version: 0,
                contents: '',
                stale: true,
                speculative: true,
            };
            for (let candidate of this.getCandidateDocumentPaths(path)) {
                this.documents.set(candidate, document);
            }
        }
        return document;
    }
    getCandidateExtensions(filename) {
        let { environment } = this.glintConfig;
        switch (environment.getSourceKind(filename)) {
            case 'template':
                return environment.templateExtensions;
            case 'typed-script':
                return environment.typedScriptExtensions;
            case 'untyped-script':
                return environment.untypedScriptExtensions;
            default:
                return [path.extname(filename)];
        }
    }
}
const SCRIPT_EXTENSION_REGEX = /\.(ts|js)$/;
export function templatePathForSynthesizedModule(path) {
    return path.replace(SCRIPT_EXTENSION_REGEX, '.hbs');
}
//# sourceMappingURL=document-cache.js.map