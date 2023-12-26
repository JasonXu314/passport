<script lang="ts">
	import Layout from '../../components/Layout.svelte';

	export let applications: Application[];
</script>

<svelte:head>
	<title>Passport | Apps</title>
</svelte:head>
<Layout>
	<h1>Applications</h1>
	<table>
		<thead>
			<tr>
				<th scope="col">ID</th>
				<th scope="col">Name</th>
				<th scope="col">Icon</th>
				<th scope="col">Base URL</th>
				<th scope="col">Revoke URL</th>
			</tr>
		</thead>
		<tbody>
			{#each applications as { id, name, icon, baseURL, revokeURL }}
				<tr>
					<td>{id}</td>
					<td><a href="/admin/apps/{id}">{name}</a></td>
					<td><img class="icon" src={icon} alt="Icon" /></td>
					<td>{baseURL}</td>
					<td>{revokeURL}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<a href="/apps/new" role="button">New Application</a>
</Layout>

<style lang="scss">
	.icon {
		max-height: 4em;
	}
</style>
