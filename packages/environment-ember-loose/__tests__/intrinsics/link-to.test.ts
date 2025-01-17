import {
  Globals,
  resolve,
  invokeBlock,
  applySplattributes,
  ElementForComponent,
} from '@glint/environment-ember-loose/-private/dsl';

let linkTo = resolve(Globals['link-to']);
let LinkTo = resolve(Globals['LinkTo']);

invokeBlock(linkTo({}, 'index', 123), {});

// Ensure we can apply <a>-specific attributes
applySplattributes<HTMLAnchorElement, ElementForComponent<Globals['LinkTo']>>();

// @ts-expect-error: bad type for route name
linkTo({}, 123);

invokeBlock(LinkTo({ route: 'index', model: 123 }), {
  default() {},
});

invokeBlock(LinkTo({ route: 'index' }), {
  default() {},
});

invokeBlock(LinkTo({ route: 'index', query: { a: 123 } }), {
  default() {},
});
