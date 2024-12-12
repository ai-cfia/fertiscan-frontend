# Flowchart for launching

## /label-data-validation

```mermaid
flowchart TD
    Start([Start]) --> LabelDataValidation["/label-data-validation"]
    LabelDataValidation --> ImagesUploaded{Images Uploaded?}
    ImagesUploaded -->|No| HomePage[Home] --> End([End])
    ImagesUploaded -->|Yes| DisplayUploadedImages["Display Uploaded Images"] --> GetExtract[GET /extract]
    GetExtract --> Success{Success?}
    Success -->|No| End
    Success -->|Yes| PostInspections[POST /inspections]
    PostInspections --> SaveSuccess{Success?}
    SaveSuccess -->|No| DisplayData[Display Data] --> End
    SaveSuccess -->|Yes| LabelDataWithID["go /label-data-validation/id"] --> End
```

## /label-data-validation/id

```mermaid
flowchart TD
    Start([Start]) --> LabelDataValidationID["/label-data-validation/id"]
    LabelDataValidationID --> ImagesUploaded{Images Uploaded?}
    ImagesUploaded -->|No| GetInspections[GET /inspections/id]
    ImagesUploaded -->|Yes| DisplayUploadedImages["Display Uploaded Images"]
    DisplayUploadedImages --> GetInspections
    GetInspections --> FetchSuccess{Success?}
    FetchSuccess -->|No| HomePage["/home"]
    FetchSuccess -->|Yes| DisplayData["Display Data"]
    DisplayData --> End([End])
    HomePage --> End
```
