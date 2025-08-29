import type * as ts from 'typescript';
import { GlintEnvironment } from '../../../config/index.js';
import { CorrelatedSpansResult } from './index.js';
import { SourceFile } from '../transformed-module.js';
import { TSLib } from '../../util.js';
export declare function calculateCompanionTemplateSpans(ts: TSLib, ast: ts.SourceFile, script: SourceFile, template: SourceFile, environment: GlintEnvironment): CorrelatedSpansResult;
