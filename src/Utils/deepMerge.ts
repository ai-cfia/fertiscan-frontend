import merge from "deepmerge";

// https://www.npmjs.com/package/deepmerge
/**
 * Custom array merging function that combines items at the same index.
 * If an item exists at the same index in both arrays, it merges them recursively.
 * Otherwise, it uses the item from the source array.
 *
 * @param target - The target array.
 * @param source - The source array to merge.
 * @param options - Options object from deepmerge.
 * @returns A new array with the combined result.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const combineMerge = (
  target: any[],
  source: any[],
  options: any,
): any[] => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === "undefined") {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = merge(target[index], item, options);
    } else {
      destination[index] = item;
    }
  });

  return destination;
};
/* eslint-enable @typescript-eslint/no-explicit-any */
