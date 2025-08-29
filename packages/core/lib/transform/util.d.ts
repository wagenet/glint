import type * as ts from 'typescript';
import { SourceFile } from './template/transformed-module.js';
export declare type TSLib = typeof ts;
export declare function unreachable(value: never, message?: string): never;
export declare function assert(test: unknown, message?: string | (() => string)): asserts test;
export declare function createSyntheticSourceFile(ts: TSLib, source: SourceFile): ts.SourceFile;
