import { GlintEnvironment } from '../../config/index.js';
import { TSLib } from '../util.js';
import TransformedModule, { SourceFile } from './transformed-module.js';
/**
 * Input to the process of rewriting a template, containing one or both of:
 *   script: the backing JS/TS module for a component, which may contain
 *           embedded templates depending on the environment
 *   template: a standalone template file
 */
export declare type RewriteInput = {
    script: SourceFile;
    template?: SourceFile;
};
/**
 * Given the script and/or template that together comprise a component module,
 * returns a `TransformedModule` representing the combined result, with the
 * template(s), either alongside or inline, rewritten into equivalent TypeScript
 * in terms of the active glint environment's exported types.
 *
 * May return `null` if an unrecoverable parse error occurs or if there is
 * no transformation to be done.
 */
export declare function rewriteModule(ts: TSLib, { script, template }: RewriteInput, environment: GlintEnvironment): TransformedModule | null;
