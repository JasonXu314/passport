<script lang="ts">
	import Layout from '../components/Layout.svelte';

	export let app: Application | null, redirectTo: string | null, badAppId: boolean;
</script>

<svelte:head>
	<title>Passport | Login</title>
</svelte:head>
<Layout>
	{#if badAppId}
		<h1 class="error"><i class="fa-solid fa-triangle-exclamation"></i> Bad login link</h1>
		<p>Unknown login destination; if you have been given this link by someone else, this may be an attempt to steal your info.</p>
	{/if}
	{#if app === null}
		<h1>Login</h1>
		<form action="/api/users/login" method="post">
			<label>
				Username
				<input name="name" type="text" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			{#if redirectTo !== null}
				<input name="redirectTo" type="hidden" value={redirectTo} />
			{/if}
			<button type="submit">Login</button>
		</form>
	{:else}
		<h1>Login to {app.name}</h1>
		<div class="icon" style:background-image={`url(${app.icon})`} />
		<form action="/api/users/login" method="post">
			<label>
				Username
				<input name="name" type="text" />
			</label>
			<label>
				Password
				<input name="password" type="password" />
			</label>
			<input name="appId" type="hidden" value={app.id} />
			{#if redirectTo !== null}
				<input name="redirectTo" type="hidden" value={redirectTo} />
			{/if}
			<button type="submit">Login</button>
		</form>
	{/if}
</Layout>

<style lang="scss">
	.icon {
		height: 8rem;
		width: 8rem;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
		margin-bottom: var(--typography-spacing-vertical);
	}
</style>
