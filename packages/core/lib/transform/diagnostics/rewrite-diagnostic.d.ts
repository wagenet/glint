import { TSLib } from '../util.js';
import TransformedModule from '../template/transformed-module.js';
import type { Diagnostic } from './index.js';
/**
 * Given a TypeScript diagnostic object from a module that was rewritten
 * by `rewriteModule`, as well as the resulting `TransformedModule`, returns
 * a rewritten version of that diagnostic that maps to the corresponding
 * location in the original source file.
 */
export declare function rewriteDiagnostic<T extends Diagnostic>(ts: TSLib, transformedDiagnostic: T, locateTransformedModule: (fileName: string) => TransformedModule | null | undefined): T;
