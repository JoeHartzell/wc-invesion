<svelte:options tag="di-select-option" />

<script lang="ts">
  import type { Writable } from "svelte/store";

  import { resolver } from "../Container/resolver";

  export let id: string;
  export let value: string;

  let state: Writable<any>;

  $: if (state) {
    state.update((s) => {
      s.options.push({ id, value });
      return s;
    });
  }
</script>

<div use:resolver={"di-select:state"} on:resolved={(e) => (state = e.detail)}>
  {value}
</div>
