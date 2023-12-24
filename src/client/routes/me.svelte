<script lang="ts">
	import { user } from '$meta';
	import Layout from '../components/Layout.svelte';

	export let grants: Grant[];
</script>

<Layout>
	<article class="user-card">
		<img src={$user.avatar} alt="Avatar" />
		<hgroup class="name">
			<h1>{$user.name}</h1>
			<h6>#{$user.discriminator}</h6>
		</hgroup>
	</article>
	<h2>Authorized Applications:</h2>
	{#each grants as { app }}
		<section>
			<h3>{app.name}</h3>
			<img src={app.icon} alt="App Icon" />
		</section>
	{/each}
</Layout>

<style>
	.user-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 2rem;
	}

	.user-card img {
		border-radius: 50%;
	}

	.user-card .name {
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}
</style>
