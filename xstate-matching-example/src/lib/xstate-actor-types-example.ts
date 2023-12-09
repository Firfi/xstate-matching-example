import { createActor, setup } from 'xstate';

const machine_ = {
  id: "Untitled",
  initial: "A",
  states: {
    A: {
      on: {
        aToB: {
          target: "B",
        },
      },
    },
    B: {},
  },
  types: { events: {} as { type: "aToB" } },
} as const;

export const machine = setup(
  {

  },

).createMachine(machine_);

const actor = createActor(machine);

actor.send({
  type: "string!"
});

actor.send({
  // @ts-expect-error needs aToB
  type: "string!"
} satisfies typeof machine_['types']['events'])

