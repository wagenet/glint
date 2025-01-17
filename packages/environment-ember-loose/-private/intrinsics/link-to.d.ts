import {
  AcceptsBlocks,
  DirectInvokable,
  ElementInvokable,
  EmptyObject,
} from '@glint/template/-private/integration';

export type LinkToKeyword = DirectInvokable<{
  (args: EmptyObject, route: string, ...params: unknown[]): AcceptsBlocks<{
    default?: [];
  }>;
}>;

export interface LinkToArgs {
  route: string;
  disabled?: boolean;
  activeClass?: string;
  'current-when'?: string;
  model?: unknown;
  preventDefault?: boolean;
  tagName?: string;
  query?: Record<string, unknown>;
}

export type LinkToComponent = new () => ElementInvokable<
  HTMLAnchorElement,
  (args: LinkToArgs) => AcceptsBlocks<{ default: [] }>
>;
