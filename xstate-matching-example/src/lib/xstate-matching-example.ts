import { createActor, setup } from "xstate";
import { match, P } from "ts-pattern";

const machine = setup({}).createMachine({
  initial: 'a',
  states: {
    a: {
      initial: 'a1',
      states: {
        a1: {},
      }
    },
    b: {
      initial: 'b1',
      states: {
        b1: {},
      }
    }
  }
});

const snapshot = createActor(machine).getSnapshot();

// type ExpectedType = {
//   a?: 'a1';
//   b?: 'b1';
// };

type UnionType = {
  a: 'a1'
} | {
  b: 'b1'
}

const matcherE1 = (s: typeof snapshot) =>
  match(s.value)
    .with({ a: 'a1' }, () => 'a1!')
    .with({ b: 'b1' }, () => 'b1!')
    // @ts-expect-error
    .exhaustive();

const matcherU1 = (s: UnionType) =>
  match(s)
    .with({ a: 'a1' }, () => 'a1!')
    .with({ b: 'b1' }, () => 'b1!')
    .exhaustive();

const matcherThatWorks = (s: typeof snapshot) =>
  match(s.value)
    .with({ a: 'a1' }, () => 'a1!')
    .with({ b: 'b1' }, () => 'b1!')
    // note that anything will work: i.e. if I put b: match; but it won't work if I omit this match altogether
    .with({ a: P.optional(P._) }, () => 'OPTIONAL')
    .exhaustive();

export const xstateMatchingExample = (): string => matcherThatWorks(snapshot)
