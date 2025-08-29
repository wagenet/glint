import { GlintConfig } from '../config/index.js';
import type * as ts from 'typescript';
export declare type TypeScript = typeof ts;
export declare function performWatch(glintConfig: GlintConfig, optionsToExtend: ts.CompilerOptions): void;
