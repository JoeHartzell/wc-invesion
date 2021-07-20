const resolve = (node: HTMLElement, dependecy: symbol | string) => {
  // request a dependency
  const event: any = new CustomEvent<symbol | string>("__resolve_dependency", {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: dependecy,
  });

  node.dispatchEvent(event);

  // check for a successful resolution
  if (event.__resolved) {
    const resolved = new CustomEvent("resolved", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: event.__resolved,
    });

    setTimeout(() => {
      console.log("Resolved:", dependecy);
      node?.dispatchEvent(resolved);
    }, 0);
  }
};

export const resolver = (node: HTMLElement, dependecy: symbol | string) => {
  resolve(node, dependecy);

  return {
    update(d: symbol) {
      resolve(node, d);
    },
  };
};
