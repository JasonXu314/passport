<script lang="ts">
	import Layout from '../components/Layout.svelte';
</script>

<svelte:head>
	<title>Passport | Signup</title>
</svelte:head>
<Layout>
	<h1>Sign Up</h1>
	<form method="POST" action="/api/users/signup">
		<label>
			Username
			<input name="name" type="text" />
		</label>
		<label>
			Password
			<input name="password" type="password" />
		</label>
		<button type="submit">Sign Up</button>
	</form>
</Layout>
