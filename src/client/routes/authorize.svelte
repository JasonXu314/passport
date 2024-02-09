<script lang="ts">
	import Layout from '../components/Layout.svelte';

	export let app: Application, redirectTo: string | undefined;
</script>

<svelte:head>
	<title>Passport | {app.name}</title>
</svelte:head>
<Layout>
	<h1>Authorize {app.name}</h1>
	<div class="icon" style:background-image={`url(${app.icon})`} />
	<form action="/api/users/authorize" method="post">
		<input name="appId" type="hidden" value={app.id} />
		{#if redirectTo !== undefined}
			<input name="redirectTo" type="hidden" value={redirectTo} />
		{/if}
		<button type="submit">Authorize</button>
	</form>
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
