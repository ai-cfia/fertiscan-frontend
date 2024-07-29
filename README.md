# Fertiscan Frontend

## Available Scripts

In the project directory, you can run:

- `npm run dev`

  Starts the development server. Open `localhost:5173` to view it in your
  browser. The app will automatically reload if you make changes to the code.
  You will see build errors and lint warnings in the console.

- `npm run dev:host`

  Starts the development server and makes it accessible over your local network.

- `npm run build`

  Compiles TypeScript and builds the app for production to the `dist` folder. It
  correctly bundles React in production mode and optimizes the build for the
  best performance. Your app is ready to be deployed!

- `npm run lint`

  Runs ESLint to find problems in your code.

- `npm run lint:fix`

  Runs ESLint to find and fix problems in your code automatically.

- `npm run preview`

  Locally previews the production build.

- `npm run test`

  Launches the test runner.

- `npm run test:watch`

  Launches the test runner in interactive watch mode.

- `npm run test:coverage`

  Runs tests and generates a coverage report.

## Running the App Using Docker

- For local testing, build the Docker image with default values: `docker build
-t fertiscan-frontend .`

- Production build:

```sh
docker build \
  --build-arg ARG_API_URL=http://your_api_url \
  --build-arg ARG_REACT_APP_ACTIVATE_USING_JSON=false \
  --build-arg ARG_REACT_APP_STATE_OBJECT_SIZE_LIMIT=4194304 \
  -t fertiscan-frontend .
```

- Run the image (on port 3001 for example): `docker run -p 3001:3000
fertiscan-frontend`

## Comprehensive Guide for New Users: Uploading a New Label

Welcome to our step-by-step guide designed to help new users like yourself effortlessly add new labels and become familiar with our platform's functionality. Let's get started.

### Saving a New Label

#### Step 1: Accessing the Website

Navigate to [FertiScan Inspection Portal](https://fertiscan.inspection.alpha.canada.ca/). Upon loading the page, you should see the following:

- ![image](https://github.com/user-attachments/assets/57b59947-13bf-4f2e-bb58-c730c2745a2e)

#### Step 2: Choosing Upload Method

You have two options to proceed:

- Use the camera feature
- Upload a file

To toggle between the camera and file upload options, follow these steps:

##### Using the Camera Feature

1. Grant camera access to your browser:

    - ![image](https://github.com/user-attachments/assets/c1613265-acf5-4030-80eb-0c3e57bddf27)
  
2. Click the "Switch" button to activate the camera:
    - ![image](https://github.com/user-attachments/assets/1f720f81-c27e-429c-b569-290faa01aba7)
3. Once in the camera view, you can switch between front and rear cameras using the camera switch button:
4. When ready, capture your picture by clicking on "Capture."

##### Uploading a File

1. Click on the large upload area:
    - ![image](https://github.com/user-attachments/assets/e3e9736f-0da4-440f-b19b-cac49bc602cb)
2. Select the desired file from your computer and confirm by clicking "Open."

#### Step 3: Managing Uploaded Files

Once uploaded, your file will appear in the list where you can:

- Delete the file by right-clicking it and selecting "Delete" or by clicking the "X" button when you hover over it:

  - ![image](https://github.com/user-attachments/assets/2e56d725-82da-48a2-a1b5-166079872399)
  - ![image](https://github.com/user-attachments/assets/8458e45d-1b24-4981-9bb8-9b41c643a121)

- Rename the file by right-clicking and choosing "Rename." Confirm the new name by clicking "Confirm":

  - ![image](https://github.com/user-attachments/assets/93a603ba-2d3d-4f94-a784-bebef5722e25)
  - ![image](https://github.com/user-attachments/assets/8c9fa0eb-3fc9-4bdb-ace9-199f4e055bc7)

#### Step 4: Submitting Your Label(s)

After uploading all necessary files, click "Submit" at the bottom of the page:

#### Step 5: Approving Label Information

A new page will display, requiring you to verify each information field:

- ![image](https://github.com/user-attachments/assets/5c1f0c14-0422-4989-92ac-5de0c685cc8f)

1. Confirm every field by clicking the checkmark next to it. A green indicator on the progress bar signifies approval:
    - ![image](https://github.com/user-attachments/assets/495d90db-2088-4365-b125-e9d6281d27d0)
2. Click on the progress bar sections to jump to specific fields as needed.
3. Zoom in on images for a clearer view.
4. Ensure that all information in each field is accurate.
5. Any field left unapproved will result in a notification:

    - ![image](https://github.com/user-attachments/assets/409607e0-f8f2-435c-b67b-c7fd9eaa611a)

#### Step 6: Final Confirmation Before Submission

After approving all fields, click on the "Submit" button to proceed:

1. Review the confirmation page thoroughly:
    - ![image](https://github.com/user-attachments/assets/30ffee47-fddf-46e7-9e0f-3d879c4130a4)
2. If an error is spotted, select "Cancel" to go back.
    - ![image](https://github.com/user-attachments/assets/3021ba01-b4d0-42cd-8790-81e623bf808c)

Once all information is verified, check the confirmation box at the bottom of the page.
The final step is to click "Confirm" to send the new label information to our database.

Congratulations! You have successfully learned how to upload and manage new labels on our platform. If you require further assistance or have any questions, don't hesitate to reach out for support.

### How to View Saved Labels

This guide will take you through the simple process of viewing all the labels you've previously saved. Follow these easy steps to get started.

#### Step 1: Accessing the Labels Overview

1. Locate and click on the second icon in the side menu:

    - ![image](https://github.com/user-attachments/assets/f27a1dd6-6861-4e0a-9c04-16a2d538a33c)

#### Step 2: Browsing Your Saved Labels

1. Upon clicking the icon, you'll be directed to the page displaying all the saved labels:
    - ![image](https://github.com/user-attachments/assets/66e7b0ce-36da-4cb0-b0f8-b6ef1aa6d6b2)
2. Scroll down to review all available labels. Pagination options may be available if you have multiple pages of saved labels.
3. To see detailed information for a specific label, simply click on the label entry you are interested in.

    - ![image](https://github.com/user-attachments/assets/c9db9320-ee98-4a63-9908-9865475ee77c)

### How to switch application language

#### Step 1: Accessing the setting page

1. Locathe and click on the third icon in the side menu

    - ![image](https://github.com/user-attachments/assets/d27c121e-ebc6-4b2d-8ef4-18d1867ced64)

### Step 2: Change the language

1. Upon clicking the icon, you'll be directed to the page displaying the setting.
2. Click on the button to switch the language between French and English.
