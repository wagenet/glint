import type * as TS from 'typescript';
import type TransformManager from '../../common/transform-manager.js';
import type TransformManagerPool from './transform-manager-pool.js';
declare type Program = TS.Program | TS.SemanticDiagnosticsBuilderProgram;
export declare function patchProgramBuilder<Args extends unknown[], T extends Program>(ts: typeof TS, transformManagerOrPool: TransformManagerPool | TransformManager, builder: (...args: Args) => T): (...args: Args) => T;
export declare function patchProgram(ts: typeof TS, program: Program, transformManagerOrPool: TransformManagerPool | TransformManager): void;
export {};
