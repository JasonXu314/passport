<script lang="ts">
	import Layout from 'src/client/components/Layout.svelte';

	export let app: Application, users: User[];
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

	<h2>Users</h2>
	<table>
		<thead>
			<tr>
				<th scope="col">ID</th>
				<th scope="col">Name</th>
				<th scope="col">Icon</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user (user.id)}
				<tr>
					<td>{user.id}</td>
					<td>{user.name}<small>#{user.discriminator}</small></td>
					<td><div class="icon small inline" style:background-image={`url(${user.avatar})`} /></td>
				</tr>
			{/each}
		</tbody>
	</table>
</Layout>

<style lang="scss">
	.icon {
		height: 8rem;
		width: 8rem;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
		margin-bottom: var(--typography-spacing-vertical);

		&.small {
			height: 3rem;
			width: 3rem;
		}

		&.inline {
			margin-bottom: 0;
		}
	}

	small {
		font-size: 0.6em;
		color: var(--h6-color);
	}
</style>
