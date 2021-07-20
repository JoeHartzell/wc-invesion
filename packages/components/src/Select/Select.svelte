<svelte:options tag="di-select" />

<script lang="ts">
  import { get, writable } from "svelte/store";
  import { Container } from "inversify";
  import { container } from "../Container/container";
  import { bind } from "svelte/internal";

  const store = writable({
    selected: null,
    options: [],
  });

  const services = new Container();
  services.bind("di-select:state").toConstantValue(store);

  $: console.log($store.options);
</script>

<div class="di-select" use:container={services.get.bind(services)}>
  <label class="di-select__trigger">Click me</label>
  <div class="di-select__options">
    <slot name="options" />
  </div>
</div>
