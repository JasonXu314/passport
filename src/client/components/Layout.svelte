<script lang="ts">
	import { extra, path, user } from '$meta';
	import { store } from 'src/client/utils/notifications.ts';
	import { toTitleCase } from 'src/client/utils/utils.ts';
	import { Readable, derived } from 'svelte/store';
	import Notification from './Notification.svelte';

	const parts: Readable<string[]> = derived(path, (path, set) => {
		set(path?.split('/') ?? []);
	});

	const apps: Readable<Application[]> = derived(extra, (extra, set) => set(extra.applications));
</script>

<main class="container">
	<nav class="navbar">
		<ul>
			<li>
				<h1>
					<a href="/">Logo Here</a>
				</h1>
			</li>
		</ul>
		<ul>
			{#if $user !== null}
				<li>
					<a href="/me">Profile</a>
				</li>
				<li>
					<details class="dropdown">
						<summary role="button" class="outline">My Apps</summary>
						<ul>
							<li><a href="/apps">All Apps</a></li>
							{#each $apps as app}
								<li><a href="/apps/{app.id}">{app.name}</a></li>
							{/each}
							<li><a href="/apps/new" role="button">Create New</a></li>
						</ul>
					</details>
				</li>
				<li>
					<a href="/logout" role="button">Log Out</a>
				</li>
				<li>
					<img src={$user.avatar} class="avatar" alt="Avatar" />
				</li>
			{:else}
				<li>
					<a href="/signup">Sign Up</a>
				</li>
				<li>
					<a href="/login" role="button">Log In</a>
				</li>
			{/if}
		</ul>
	</nav>
	<nav class="breadcrumbs" aria-label="breadcrumb">
		{#if $path !== '/'}
			<ul>
				{#each $parts as fragment, i}
					<li>
						<a href="{$parts.slice(0, i).join('/')}/{fragment}">{toTitleCase(fragment)}</a>
					</li>
				{/each}
			</ul>
		{/if}
	</nav>
	<slot>No content</slot>
	<div class="notification-container">
		{#each $store as notification}
			<Notification {...notification} />
		{/each}
	</div>
</main>

<style lang="scss">
	main {
		overflow-x: hidden;

		.navbar {
			h1 {
				margin: 0;
			}

			.avatar {
				border-radius: 50%;
				max-height: 3em;
			}
		}

		.breadcrumbs {
			margin-bottom: calc(var(--block-spacing-vertical) / 2);
		}

		.notification-container {
			position: absolute;
			top: 2rem;
			right: 2rem;
			display: flex;
			flex-direction: column;
			gap: 1em;
			overflow-x: visible;
			z-index: 1000;
		}
	}
</style>
