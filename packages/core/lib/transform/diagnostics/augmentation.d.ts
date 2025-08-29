import { Diagnostic } from './index.js';
import MappingTree from '../template/mapping-tree.js';
/**
 * Given a diagnostic and a mapping tree node corresponding to its location,
 * returns updated message text for that diagnostic with Glint-specific
 * information included, if applicable.
 */
export declare function augmentDiagnostic<T extends Diagnostic>(diagnostic: T, mapping: MappingTree): T;
