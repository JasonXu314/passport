/// <reference types="svelte" />
/// <reference types="vite/client" />

type Writable<T> = import('svelte/store').Writable<T>;

type User = import('src/users/models').PublicUser;
type FullUser = import('src/users/models').User;
type Application = import('@prisma/client').Application;
declare module '*.svelte' {
	const component: ConstructorOfATypedSvelteComponent;
	export default component;
}

declare module '$meta' {
	export const path: Writable<string>;
	export const user: Writable<User>;
	export const extra: Writable<any>;
}

type Grant = import('@prisma/client').Grant & {
	app: Application;
};

interface PageProps {
	user: User | null;
	__meta?: any;
}

interface LoginProps extends PageProps {
	app: Application | null;
	redirectTo: string | null;
	referrer: string | null;
	badAppId: boolean;
}

interface MeProps extends PageProps {
	grants: Grant[];
}
