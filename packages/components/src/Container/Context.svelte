<svelte:options tag="di-container" />

<script context="module" lang="ts">
  import { Container } from "inversify";

  export let TYPES = {
    People: Symbol.for("People"),
    Todo: Symbol.for("Todo"),
  };

  export interface Person {
    firstName: string;
    lastName: string;
  }

  export interface Todo {
    task: string;
  }
</script>

<script lang="ts">
  import type { Writable } from "svelte/store";
  import { writable } from "svelte/store";
  import faker from "faker";
  import { container } from "./container";

  export let name: string;

  const people = writable<Person[]>([]);
  const todo = writable<Todo[]>([]);
  const myContainer = new Container();

  myContainer.bind<Writable<Person[]>>(TYPES.People).toConstantValue(people);
  myContainer.bind<Writable<Todo[]>>(TYPES.Todo).toConstantValue(todo);

  const container2 = new Map<symbol, any>();

  container2.set(TYPES.People, people);
  container2.set(TYPES.Todo, todo);

  const handleClick = () => {
    people.update((current) => {
      return current.concat({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      });
    });
  };

  const handleAddTask = () => {
    todo.update((current) => {
      return current.concat({
        task: faker.lorem.words(),
      });
    });
  };

  $: {
    console.log("Name changed:", name);
  }
</script>

<button on:click={handleClick}>Add Person</button>
<button on:click={handleAddTask}>Add Task</button>

<div use:container={container2.get.bind(container2)}>
  {name}
  {container2}
  <slot name="top" />
</div>

<div use:container={myContainer.get.bind(myContainer)}>
  {myContainer}
  <slot name="bottom" />
</div>

<style>
  div {
    border: 1px solid gray;
    margin: 1rem;
    display: flex;
    flex-direction: row;
  }
</style>
