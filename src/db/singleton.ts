export type ClientStore<T> = {
  current?: T;
};

export function getOrCreateClient<T>(
  store: ClientStore<T>,
  create: () => T,
): T {
  if (!store.current) {
    store.current = create();
  }

  return store.current;
}
