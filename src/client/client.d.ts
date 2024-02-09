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
	export const extra: Writable<{ applications: Application[] }>;
}

type Grant = import('@prisma/client').Grant & {
	app: Application;
};

interface PageProps<T extends Record<string, any> = Record<string, any>> {
	user: User | null;
	__meta: T & { applications: Application[] };
	__path?: string;
}

interface LoginProps extends PageProps {
	app: Application | null;
	redirectTo: string | null;
	badAppId: boolean;
}

interface AuthorizeProps extends PageProps {
	app: Application;
	redirectTo?: string;
}

interface MeProps extends PageProps {
	grants: Grant[];
}

interface AppsProps extends PageProps {
	applications: Application[];
}

interface AppProps extends PageProps {
	app: Application;
	users: User[];
	__path: string;
}

