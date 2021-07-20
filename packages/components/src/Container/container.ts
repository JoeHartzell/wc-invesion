export const container = (
  node: HTMLElement,
  resolver: <T>(dependency: any) => T
) => {
  const resolveDependency = (e: CustomEvent) => {
    const d = resolver(e.detail);

    if (d) {
      (e as any).__resolved = d;
      e.stopPropagation();
    }
  };

  node.addEventListener("__resolve_dependency", resolveDependency);

  return {
    destroy() {
      node.removeEventListener("__resolve_dependency", resolveDependency);
    },
  };
};
