<script lang="ts">
	import Layout from '../components/Layout.svelte';
</script>

<svelte:head>
	<title>Passport</title>
</svelte:head>
<Layout>
	<h1>Auth Provider for my stuff</h1>
	<p>Based on Auth0, but easier to use</p>
	<a href="/login" role="button">Login</a> or <a href="/signup" role="button">Sign Up</a> to get started.
</Layout>
