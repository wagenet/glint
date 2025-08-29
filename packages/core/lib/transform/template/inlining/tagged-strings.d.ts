import type * as ts from 'typescript';
import { GlintEnvironment } from '../../../config/index.js';
import { CorrelatedSpansResult } from './index.js';
import { SourceFile } from '../transformed-module.js';
import { TSLib } from '../../util.js';
import { GlintEmitMetadata } from '@glint/core/config-types';
export declare function calculateTaggedTemplateSpans(ts: TSLib, node: ts.TaggedTemplateExpression, meta: GlintEmitMetadata | undefined, script: SourceFile, environment: GlintEnvironment): CorrelatedSpansResult;
