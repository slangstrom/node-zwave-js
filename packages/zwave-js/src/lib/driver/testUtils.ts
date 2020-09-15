/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { assign, Machine, spawn, StateMachine } from "xstate";
import type { Message } from "../message/Message";

export const createSendDataResolvesNever = () =>
	jest.fn().mockImplementation(
		() => new Promise<unknown>(() => {}),
	);
export const createSendDataResolvesImmediately = () =>
	jest.fn().mockResolvedValue(undefined);
export const createSendDataRejectsImmediately = () =>
	jest.fn().mockRejectedValue(new Error("nope"));

const defaultImplementations = {
	serialize: () => Buffer.from([1, 2, 3]),
	getNodeUnsafe: () => undefined,
	getNodeId: () => undefined,
	toLogEntry: () => ({ tags: [] }),
	needsCallbackId: () => true,
};

export const dummyMessageNoResponseNoCallback = ({
	expectedResponse: undefined,
	expectedCallback: undefined,
	hasCallbackId: () => false,
	...defaultImplementations,
} as any) as Message;
export const dummyMessageWithResponseNoCallback = ({
	expectedResponse: 0xff,
	expectedCallback: undefined,
	hasCallbackId: () => false,
	...defaultImplementations,
} as any) as Message;
export const dummyMessageNoResponseWithCallback = ({
	expectedResponse: undefined,
	expectedCallback: true,
	hasCallbackId: () => true,
	callbackId: 1,
	...defaultImplementations,
} as any) as Message;
// export const dummyMessageWithResponseWithCallback = ({
// 	serialize: () => Buffer.from([1, 2, 3]),
// 	expectedResponse: true,
// 	expectedCallback: true,
// } as any) as Message;

export function createWrapperMachine(testMachine: StateMachine<any, any, any>) {
	return Machine<any, any, any>({
		context: {
			ref: undefined,
		},
		initial: "main",
		states: {
			main: {
				entry: assign({
					ref: () =>
						spawn(testMachine, {
							name: "child",
							autoForward: true,
						}),
				}),
			},
		},
	});
}
