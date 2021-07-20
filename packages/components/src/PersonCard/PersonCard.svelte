<svelte:options tag="person-card" />

<script lang="ts">
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import { TYPES } from "../Container/Context.svelte";
  import { resolver } from "../Container/resolver";
  import "../Container/ContainerResolver.svelte";
  import type { Person, Todo } from "../Container/Context.svelte";

  export let people: Writable<Person[]> = writable([]);
  export let todo: Writable<Todo[]>;

  let dependency = TYPES.People;
</script>

<h2>People</h2>
<ul use:resolver={dependency} on:resolved={(e) => (people = e.detail)}>
  {#each $people || [] as p}
    <li>{p.firstName} {p.lastName}</li>
  {/each}
</ul>

<h2>Tasks</h2>
<ul use:resolver={TYPES.Todo} on:resolved={(e) => (todo = e.detail)}>
  {#each $todo || [] as p}
    <li>{p.task}</li>
  {/each}
</ul>
