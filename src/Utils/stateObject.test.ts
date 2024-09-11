import { describe, expect, it } from "vitest";
import StateType from "../interfaces/StateType";
import Data from "../Model/Data-Model";
import { stateObjectExceedsLimit } from "./stateObject";
import Inspection from "../interfaces/Inspection.ts";
describe("State Object Size tests", () => {
  it("should return true if the state object size exceeds the limit", () => {
    const mockState: StateType = {
      data: {
        pics: [
          {
            blob: "long long blob",
            name: "",
          },
          {
            blob: "long long blob",
            name: "",
          },
          {
            blob: "long long blob",
            name: "",
          },
        ],
        form: new Data([]),
        inspection: {} as Inspection,
      },
      state: "",
    };

    const result = stateObjectExceedsLimit(mockState, 14 * 3 + 1);

    expect(result).toBe(true);
  });

  it("should return false if the state object size doesn't exceeds the limit", () => {
    const mockState: StateType = {
      data: {
        pics: [
          {
            blob: "long long blob",
            name: "",
          },
          {
            blob: "long long blob",
            name: "",
          },
          {
            blob: "long long blob",
            name: "",
          },
        ],
        form: new Data([]),
        inspection: {} as Inspection,
      },
      state: "",
    };

    const result = stateObjectExceedsLimit(mockState, 14 * 3);

    expect(result).toBe(true);
  });
});
