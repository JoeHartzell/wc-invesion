<svelte:options tag="container-resolver" />

<script lang="ts">
  import { onMount } from "svelte";
  import { get_current_component } from "svelte/internal";

  export let dependency: symbol;

  let resolved: any;

  const component: HTMLElement = get_current_component();

  onMount(() => {
    const resolve: any = new CustomEvent<symbol>("__resolve_dependency", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: dependency,
    });

    component?.dispatchEvent(resolve);

    resolved = resolve.__resolved;
  });

  $: if (resolved && component) {
    console.log("Resolved:", dependency);
    component?.dispatchEvent(
      new CustomEvent<any>("resolved", {
        detail: resolved,
      })
    );
  }
</script>
