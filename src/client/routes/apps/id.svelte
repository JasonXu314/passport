<script lang="ts">
	import Layout from 'src/client/components/Layout.svelte';

	export let app: Application;
</script>

<svelte:head>
	<title>Passport | Application {app.name}</title>
</svelte:head>
<Layout>
	<h1>{app.name}</h1>
	<div>
		<div class="icon" style:background-image={`url(${app.icon})`} />
		<table>
			<tbody>
				<tr>
					<td>Base URL</td>
					<td>{app.baseURL}</td>
				</tr>
				<tr>
					<td>Revokation Endpoint</td>
					<td>{app.revokeURL}</td>
				</tr>
			</tbody>
		</table>
	</div>
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
