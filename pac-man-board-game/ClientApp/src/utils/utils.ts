/**
 * Waits until the predicate is true
 * @param predicate The predicate to wait for.
 * @param timeout The timeout between checks.
 * @returns A promise that resolves when the predicate is true.
 */
export function wait(predicate: Predicate<void>, timeout: number = 50): Promise<void> {
  return new Promise<void>((resolve) => {
    const f = () => {
      if (predicate()) {
        return resolve();
      }
      setTimeout(f, timeout);
    };

    f();
  });
}
