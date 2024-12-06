# Flowchart for launching

## /label-data-validation

```mermaid
flowchart TD
    Start([Start]) --> LabelDataValidation["/label-data-validation"]
    LabelDataValidation --> ImagesUploaded{Images Uploaded?}
    ImagesUploaded -->|No| HomePage[Home] --> End([End])
    ImagesUploaded -->|Yes| GetExtract[GET /extract]
    GetExtract --> Success{Success?}
    Success -->|No| End
    Success -->|Yes| PostInspections[POST /inspections]
    PostInspections --> SaveSuccess{Success?}
    SaveSuccess -->|No| DisplayData[Display Data] --> End
    SaveSuccess -->|Yes| StoreData[Store Data] --> LabelDataWithID["/label-data-validation/id"] --> End
```

## /label-data-validation/id

```mermaid
flowchart TD
    Start([Start]) --> LabelDataValidationID["/label-data-validation/id"]
    LabelDataValidationID --> ImagesUploaded{Images Uploaded?}
    ImagesUploaded -->|No| HomePage["/home"]
    ImagesUploaded -->|Yes| DataInStore{labelData in store?}
    DataInStore -->|No| GetInspections[GET /inspections/id]
    DataInStore -->|Yes| DisplayData["Display Data"]
    GetInspections --> FetchSuccess{Success?}
    FetchSuccess -->|No| HomePage
    FetchSuccess -->|Yes| DisplayData
    DisplayData --> End([End])
    HomePage --> End
```
