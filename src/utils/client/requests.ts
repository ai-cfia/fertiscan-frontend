import { processFetchedBlob } from "@/classes/File";
import { getAuthHeader } from "@/utils/client/cookies";
import axios from "axios";

export function fetchImages(
  pictureSetId: string,
  signal?: AbortSignal,
): Promise<File[]> {
  if (!pictureSetId) return Promise.resolve([]);

  return axios
    .get<string[]>(`/api-next/pictures/${pictureSetId}`, {
      headers: { Authorization: getAuthHeader() },
      signal,
    })
    .then((res) => {
      const pictureIds = res.data;

      return Promise.all(
        pictureIds.map((pictureId) =>
          axios
            .get(`/api-next/pictures/${pictureSetId}/${pictureId}`, {
              headers: { Authorization: getAuthHeader() },
              responseType: "blob",
              signal,
            })
            .then((res) => processFetchedBlob(res.data, pictureId)),
        ),
      );
    })
    .then((files) => files.filter((file): file is File => file !== null));
}
