/**
 * Response body
 *
 * [
 *   {
 *     "id": "5cabc8c4-e418-4bf0-84b4-eeb2aa9c30c7",
 *     "upload_date": "2024-12-12T16:52:56.728348",
 *     "updated_at": "2024-12-12T16:52:56.728348",
 *     "sample_id": null,
 *     "picture_set_id": "ea19b682-dfe0-4216-baa1-6f2410c0e604",
 *     "label_info_id": "e7ccd300-e0f6-4912-8bbb-d1cb9db6ae7e",
 *     "product_name": "Granular Zinc 20%",
 *     "manufacturer_info_id": null,
 *     "company_info_id": "e0c43744-21f1-4c68-a4c8-e6f498f0b708",
 *     "company_name": "Cameron Chemicals, Inc."
 *   },
 *   {
 *     "id": "bf78d5aa-92e9-4be0-9a4a-393dd892a76d",
 *     "upload_date": "2024-12-17T18:15:28.043513",
 *     "updated_at": "2024-12-17T18:17:01.313238",
 *     "sample_id": null,
 *     "picture_set_id": null,
 *     "label_info_id": "b9c8a95d-4f99-47aa-b0f3-279788dcf296",
 *     "product_name": "test2",
 *     "manufacturer_info_id": "23aa9ed9-543b-49a7-8945-c680a47266f5",
 *     "company_info_id": "ae386ab9-f702-474b-ab13-b102a464dc70",
 *     "company_name": "WILLIAM HO"
 *   }
 * ]
 *
 * Response headers
 *
 *  content-length: 816  content-type: application/json  date: Tue,17 Dec 2024 18:24:31 GMT  server: uvicorn
 */
type InspectionPreview = {
  id: string;
  upload_date: string;
  updated_at: string;
  sample_id: string | null;
  picture_set_id: string | null;
  label_info_id: string;
  product_name: string | null;
  manufacturer_info_id: string | null;
  company_info_id: string;
  company_name: string | null;
};
export default InspectionPreview;
