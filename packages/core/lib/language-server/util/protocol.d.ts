import type * as ts from 'typescript';
import { CompletionItemKind, DiagnosticSeverity, DiagnosticTag, SymbolKind } from 'vscode-languageserver';
declare type TS = typeof ts;
export declare function scriptElementKindToCompletionItemKind(ts: TS, kind: ts.ScriptElementKind): CompletionItemKind;
export declare function scriptElementKindToSymbolKind(ts: TS, kind: ts.ScriptElementKind): SymbolKind;
export declare function tagsForDiagnostic(diagnostic: ts.Diagnostic): DiagnosticTag[];
export declare function severityForDiagnostic(ts: TS, diagnostic: ts.Diagnostic): DiagnosticSeverity;
export {};
