<script lang="ts">
	import axios from 'axios';
	import Layout from '../components/Layout.svelte';

	let name: string, password: string;

	function signup(): void {
		axios
			.post('/api/users/signup', { name, password })
			.then(() => {
				location.pathname = '/login';
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

<svelte:head>
	<title>Passport | Signup</title>
</svelte:head>
<Layout>
	<h1>Sign Up</h1>
	<form on:submit|preventDefault={signup}>
		<label>
			Username
			<input type="text" bind:value={name} />
		</label>
		<label>
			Password
			<input type="password" bind:value={password} />
		</label>
		<button type="submit">Sign Up</button>
	</form>
</Layout>
