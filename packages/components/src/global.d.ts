/// <reference types="svelte" />

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onresolved?: (e: CustomEvent) => void;
  }
}
