import type { Invoke, Invokable, EmptyObject } from '@glint/template/-private/integration';

declare const Ember: { Helper: EmberHelperConstructor };

type EmberHelper = import('@ember/component/helper').default;
type EmberHelperConstructor = typeof import('@ember/component/helper').default;

const EmberHelper = Ember.Helper;
const emberHelper = Ember.Helper.helper;

type Get<T, Key, Otherwise = EmptyObject> = Key extends keyof T
  ? Exclude<T[Key], undefined>
  : Otherwise;

type HelperFactory = <Positional extends unknown[] = [], Named = EmptyObject, Return = unknown>(
  fn: (params: Positional, hash: Named) => Return
) => new () => Invokable<(named: Named, ...positional: Positional) => Return>;

export const helper = (emberHelper as unknown) as HelperFactory;

export interface HelperSignature {
  NamedArgs?: Record<string, unknown>;
  PositionalArgs?: Array<unknown>;
  Return?: unknown;
}

// Overriding `compute` directly is impossible because the base class has such
// wide parameter types, so we explicitly exclude that from the interface we're
// extending here so our override can "take" without an error.
const Helper = (EmberHelper as unknown) as new <T extends HelperSignature>(
  ...args: ConstructorParameters<EmberHelperConstructor>
) => Helper<T>;

interface Helper<T extends HelperSignature> extends Omit<EmberHelper, 'compute'> {
  compute(
    params: Get<T, 'PositionalArgs', []>,
    hash: Get<T, 'NamedArgs'>
  ): Get<T, 'Return', undefined>;

  [Invoke]: (
    named: Get<T, 'NamedArgs'>,
    ...positional: Get<T, 'PositionalArgs', []>
  ) => Get<T, 'Return'>;
}

export default Helper;
