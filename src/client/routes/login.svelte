<script lang="ts">
	export let appId: number, redirectTo: string, referrer: string;
</script>

<form action="/login" method="POST">
	<label>
		Username
		<input type="text" name="name" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	<button type="submit">Login</button>
</form>
