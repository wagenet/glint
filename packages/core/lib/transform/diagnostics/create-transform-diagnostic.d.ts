import { TSLib } from '../util.js';
import { SourceFile, Range } from '../template/transformed-module.js';
import type { Diagnostic } from './index.js';
export declare function createTransformDiagnostic(ts: TSLib, source: SourceFile, message: string, location: Range, isContentTagError?: boolean): Diagnostic;
