/// <reference types="svelte" />
/// <reference types="vite/client" />

type Writable<T> = import('svelte/store').Writable<T>;

type User = import('src/users/models').PublicUser;
type FullUser = import('src/users/models').User;

declare module '*.svelte' {
	const component: ConstructorOfATypedSvelteComponent;
	export default component;
}

declare module '$meta' {
	export const path: Writable<string>;
	export const user: Writable<FullUser>;
	export const extra: Writable<any>;
}

