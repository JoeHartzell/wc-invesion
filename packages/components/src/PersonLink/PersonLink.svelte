<svelte:options tag="person-link" />

<script lang="ts">
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";
  import type { Writable } from "svelte/store";
  import { TYPES } from "../Container/Context.svelte";
  import type { Person } from "../Container/Context.svelte";
  import { resolver } from "../Container/resolver";

  let people: Writable<Person[]>;
</script>

<ul use:resolver={TYPES.People} on:resolved={(e) => (people = e.detail)}>
  {#each $people || [] as person}
    <li>{person.firstName}</li>
  {/each}
</ul>
