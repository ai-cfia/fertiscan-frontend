import { describe, expect, it } from "vitest";
import StateType from "../interfaces/StateType";
import Data from "../Model/Data-Model";
import {
  calculateStateObjectSize,
  stateObjectExceedsLimit,
} from "./stateObject";

describe("State Object Size Calculations", () => {
  it("should calculate the size of the state object in bytes and megabytes", () => {
    const mockState: StateType = {
      data: {
        pics: [
          {
            size: 1048576, // 1 MB
            blob: "",
            name: "",
          },
          {
            size: 2097152, // 2 MB
            blob: "",
            name: "",
          },
          {
            size: 1048576, // 1 MB
            blob: "",
            name: "",
          },
        ],
        form: new Data([]),
      },
      state: "",
    };

    const result = calculateStateObjectSize(mockState);

    expect(result.bytes).toBe(4194304); // 4 MB in bytes
    expect(result.megabytes).toBe(4); // 4 MB
  });

  it("should return false if the state object size does not exceed the limit", () => {
    const mockState: StateType = {
      data: {
        pics: [
          {
            size: 1048576,
            blob: "",
            name: "",
          }, // 1 MB
          {
            size: 2097152,
            blob: "",
            name: "",
          }, // 2 MB
          {
            size: 1048576,
            blob: "",
            name: "",
          }, // 1 MB
        ],
        form: new Data([]),
      },
      state: "",
    };

    const result = stateObjectExceedsLimit(mockState);

    expect(result).toBe(false); // 4 MB should not exceed the default limit
  });

  it("should return true if the state object size exceeds the limit", () => {
    const mockState: StateType = {
      data: {
        pics: [
          {
            size: 1048576,
            blob: "",
            name: "",
          }, // 1 MB
          {
            size: 2097152,
            blob: "",
            name: "",
          }, // 2 MB
          {
            size: 2097152,
            blob: "",
            name: "",
          }, // 2 MB
        ],
        form: new Data([]),
      },
      state: "",
    };

    const result = stateObjectExceedsLimit(mockState, 4194304); // Setting limit to 4 MB

    expect(result).toBe(true); // 5 MB should exceed the default limit
  });

  it("should respect the custom limit when provided", () => {
    const mockState: StateType = {
      data: {
        pics: [
          {
            size: 1048576,
            blob: "",
            name: "",
          }, // 1 MB
          {
            size: 1048576,
            blob: "",
            name: "",
          }, // 1 MB
        ],
        form: new Data([]),
      },
      state: "",
    };

    const result = stateObjectExceedsLimit(mockState, 1048576); // Setting limit to 1 MB

    expect(result).toBe(true); // 2 MB should exceed the custom limit
  });
});
