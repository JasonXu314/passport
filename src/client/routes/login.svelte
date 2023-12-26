<script lang="ts">
	import axios from 'axios';
	import type { LoginSuccessDTO } from 'src/users/dtos';
	import Layout from '../components/Layout.svelte';

	export let app: Application | null, redirectTo: string | null, referrer: string | null, badAppId: boolean;
	let name: string, password: string;

	function login(): void {
		axios
			.post<LoginSuccessDTO>('/api/users/login', { name, password })
			.then((res) => {
				location.assign(res.data.redirectURL);
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

<svelte:head>
	<title>Passport | Login</title>
</svelte:head>
<Layout>
	{#if badAppId}
		<h1 class="error"><i class="fa-solid fa-triangle-exclamation"></i> Bad login link</h1>
		<p>Unknown login destination; if you have been given this link by someone else, this may be an attempt to steal your info.</p>
	{/if}
	<h1>Login</h1>
	<form on:submit|preventDefault={login}>
		<label>
			Username
			<input type="text" bind:value={name} />
		</label>
		<label>
			Password
			<input type="password" bind:value={password} />
		</label>
		<button type="submit">Login</button>
	</form>
</Layout>
