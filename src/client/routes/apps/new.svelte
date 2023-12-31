<script lang="ts">
	import axios from 'axios';
	import Layout from 'src/client/components/Layout.svelte';

	let name: string, baseURL: string, icon: FileList, revokeURL: string;

	function create(): void {
		if (icon.length > 0) {
			axios
				.postForm<Application>('/api/apps/new', { name, baseURL, revokeURL, icon: icon.item(0) })
				.then((res) => {
					location.assign(`/apps/${res.data.id}`);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
</script>

<svelte:head>
	<title>Passport | Create App</title>
</svelte:head>
<Layout>
	<h1>New Application</h1>
	<form on:submit|preventDefault={create}>
		<label>
			Name
			<input type="text" bind:value={name} />
		</label>
		<label>
			Base URL
			<input type="text" bind:value={baseURL} />
		</label>
		<label>
			Icon
			<input type="file" bind:files={icon} />
		</label>
		<label>
			Revokation URL
			<input type="text" bind:value={revokeURL} />
		</label>
		<button type="submit">Create</button>
	</form>
</Layout>
