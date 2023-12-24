<script lang="ts">
	import { fly } from 'svelte/transition';

	export let title: string = null,
		text: string = null,
		err: boolean = false;
</script>

<article class:err transition:fly={{ x: '60%' }}>
	<slot>
		{#if err}
			<i class="fa-solid fa-triangle-exclamation" />
		{:else}
			<progress />
		{/if}
		<hgroup>
			<h1>{title}</h1>
			<h2>{text}</h2>
		</hgroup>
	</slot>
</article>

<style lang="scss">
	article {
		padding: 0.5rem 1rem;
		margin: 0;
		--card-background-color: var(--form-element-background-color);

		hgroup {
			margin: 0;

			h1 {
				font-size: 1.5rem;
			}

			h2 {
				font-size: 1.25rem;
			}
		}

		&.err {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1em;

			i {
				font-size: 2rem;
				color: var(--error);
			}
		}
	}
</style>
