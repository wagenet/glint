import type * as TS from 'typescript';
import TransformManager from '../../common/transform-manager.js';
import TransformManagerPool from './transform-manager-pool.js';
export declare function sysForCompilerHost(ts: typeof TS, transformManagerOrPool: TransformManager | TransformManagerPool): TS.System;
