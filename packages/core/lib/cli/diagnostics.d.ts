import type * as TS from 'typescript';
declare type TypeScript = typeof TS;
export declare function buildDiagnosticFormatter(ts: TypeScript): (diagnostic: TS.Diagnostic) => string;
export {};
