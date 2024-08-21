import StateType from "../interfaces/StateType";

/**
 * The default size limit for the state object in bytes.
 * Defaults to 4194304 bytes (4 MB).
 */
export const STATE_OBJECT_SIZE_LIMIT = parseInt(
  process.env.VITE_APP_STATE_OBJECT_SIZE_LIMIT || "4194304",
);

/**
 * Function to calculate the total size of the blob data in the state object in bytes and megabytes.
 *
 * @param state - The state object containing blob data to calculate the size of.
 * @returns An object containing the size in bytes and megabytes.
 */
export function calculateStateObjectSize(state: StateType): {
  bytes: number;
  megabytes: number;
} {
  const totalSize = new TextEncoder().encode(JSON.stringify(state)).length;
  const megabytes = totalSize / (1024 * 1024);

  return {
    bytes: totalSize,
    megabytes,
  };
}

/**
 * Function to check if the total size of the state object exceeds a specified limit.
 *
 * @param state - The state object containing blob data to calculate the size of.
 * @param limit - The size limit in bytes. Defaults to STATE_OBJECT_SIZE_LIMIT.
 * @returns A boolean indicating whether the total size of the state object exceeds the limit.
 */
export function stateObjectExceedsLimit(
  state: StateType,
  limit: number = STATE_OBJECT_SIZE_LIMIT,
): boolean {
  const totalSize = calculateStateObjectSize(state);
  return totalSize.bytes > limit;
}
