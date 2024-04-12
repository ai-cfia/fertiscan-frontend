import datetime
import json
import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
import pandas as pd
from difflib import SequenceMatcher
from typing import Dict
from difflib import SequenceMatcher
from typing import List

typeOfQuestion = "Original_question"
QUESTION_TYPE = "original_question"
FIRST_REQUEST = True

# Function to collect images from a directory
def collect_images(directory):
    image_extensions = [".jpg", ".jpeg", ".png"]
    image_paths = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in image_extensions):
                image_paths.append(os.path.join(root, file))
    return image_paths

# Function to get image data list from image paths
def get_list_image(image_paths):
    request = []
    for image_data in image_paths:
        with open(image_data, 'rb') as f:
            image = f.read()
            request.append(Part.from_data(data=image, mime_type="image/jpeg"))
    return request

# Function to add text to the request
def add_text(request, baseQuestions=None):
    if baseQuestions == None:
        request.append(create_base_request(read_csv_file("base_composition_questions.csv")))
    else:
        request.append(create_final_request(read_csv_file("questions_spreadsheet.csv"), baseQuestions))
    return request

# Function to generate a request
def generate_request(directory, model:GenerativeModel, vertex:vertexai, choiceOfQuestions, baseQuestions=None):
    global typeOfQuestion
    global firstRequest
    typeOfQuestion = choiceOfQuestions
    request = get_list_image(collect_images(directory))
    if baseQuestions == None:
        request = add_text(request, None)
    else:
        request = add_text(request, baseQuestions)
    responses = model.generate_content(request,
        generation_config={
        "max_output_tokens": 2048,
        "temperature": 0,
        "top_p": 1,
        "top_k": 32
        },
        safety_settings=(
        {
            generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        }
    ),
        stream=False,
    )

    if not firstRequest:
        result_to_json_file(responses.text, directory)
        firstRequest = True
    else:
        # Extract JSON content from raw text
        response = responses.text
        start_index = response.find('{')
        end_index = response.rfind('}') + 1
        json_content = response[start_index:end_index]
        # Parse JSON
        baseQuestions = json.loads(json_content)
        firstRequest = False
    return baseQuestions

# Function to convert response to dictionary
def to_dict(responses, baseQuestions):
    responseAsDict = {}
    if baseQuestions == None:
        for response in responses:
            texte = response
            indice = texte.find(":")
            partie_avant = texte[:indice]
            partie_apres = texte[indice + 1:]
            responseAsDict[partie_avant] = partie_apres
    return responseAsDict

# Function to read CSV file
def read_csv_file(file_path):
    # Read csv file
    df = pd.read_csv(file_path, sep=';')
    return df

# Function to create base request
def create_base_request(file):
    requestAsText = ""
    for index, line in file.iterrows():
        if not line.isnull().all():
            specification = line['Specification']
            requestAsText += str(specification) + "\n"

        line_text = str(line['Key']) + ":" + str(line['Question']) + "; \n"
        requestAsText += line_text
    return requestAsText

# Function to create final request
def  create_final_request(file, baseQuestions):
    request_AsText = ""
    for index, line in file.iterrows():
        if not line.isnull().all():
            categorie = str(line['Categories'])

            if line['Specification'] != None:
                request_AsText += str(line['Specification']) + "\n"

            if line['Categories'] != None:
                if "all" in categorie:
                    request_AsText = add_line(request_AsText, line)

                if  "fertilizer"in categorie and"is_fertilizer" in baseQuestions:
                    if "contain_pesticide" in baseQuestions:
                        if "pesticide" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "is_seed" in baseQuestions:
                        if "seed" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "is_tank_mixing" in baseQuestions:
                        if "tank_mixing" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie :
                            request_AsText = add_line(request_AsText, line)

                    if "contain_organic_matter" in baseQuestions:
                        if "organic_matter" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_phosphate" in baseQuestions:
                        if "phosphate" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_micronutrient" in baseQuestions:
                        if "micronutrient" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_nutrient" in baseQuestions:
                        if "nutrient" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if  "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie:
                            request_AsText = add_line(request_AsText, line)

                elif "supplement" in categorie and "is_supplement" in baseQuestions:

                    if "contain_pesticide" in baseQuestions:
                        if "pesticide" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "is_seed" in baseQuestions:
                        if "seed" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "is_tank_mixing" in baseQuestions:
                        if "tank_mixing" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie :
                            request_AsText = add_line(request_AsText, line)

                    if "contain_organic_matter" in baseQuestions:
                        if "organic_matter" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_phosphate" in baseQuestions:
                        if "phosphate" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_micronutrient" in baseQuestions:
                        if "micronutrient" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if "contain_nutrient" in baseQuestions:
                        if "nutrient" in categorie:
                            request_AsText = add_line(request_AsText, line)

                    if  "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie:
                            request_AsText = add_line(request_AsText, line)

                elif "contain_growing_medium" in baseQuestions:
                    if "growing_medium" in categorie:
                        request_AsText = add_line(request_AsText, line)

                if  "is_mixture_product" in baseQuestions:
                    if "mixture_product" in categorie:
                        request_AsText = add_line(request_AsText, line)

                if "contain_allergen" in baseQuestions:
                    if "allergen" in categorie:
                        request_AsText = add_line(request_AsText, line)

                if "contain_acronyms" in baseQuestions:
                    if "acronyms" in categorie:
                        request_AsText = add_line(request_AsText, line)

                if "contain_polymeric" in baseQuestions:
                    if "polymeric" in categorie:
                        request_AsText = add_line(request_AsText, line)
    baseQuestions == None
    return request_AsText

# Function to add a line to the request
def add_line(requestAsText, line):
    global typeOfQuestion
    if not line.isnull().all():
        line_text = str(line['Key']) + ":" + str(line[typeOfQuestion]) + "\n"
        requestAsText += line_text
    return requestAsText

# Function to write results to a JSON file
def result_to_json_file(responses, directory):
    global typeOfQuestion  # Using global variable typeOfQuestion
    lastIndex = directory.rfind('\\')
    imageName = directory[lastIndex+1:]
    imageName = imageName.split(".")[0].lower()
    date_time  = datetime.datetime.now().strftime("%Y-%m-%d_%Hh%Mm%Ss")  # Get current date and time
    if typeOfQuestion == "Original_question":
        # Define folder path based on the type of question
        folder_path = f"tests\\tests_result\\original_question\\{imageName}"
    else:
        folder_path = f"tests\\tests_result\\modified_question\\{imageName}"

    # Create folder if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    # Define file path using image name and current date-time
    file_path = os.path.join(folder_path, f"{date_time}_test.json")

    # Extract JSON content from raw text response
    start_index = responses.find('{')
    end_index = responses.rfind('}') + 1
    json_content = responses[start_index:end_index]

    # Try parsing JSON content
    try:
        data_formatted = json.loads(json_content)
    except json.JSONDecodeError as e:
        # Print error message if JSON parsing fails
        print(f"Error parsing JSON: {e}")
        data_formatted = {}  # Assign empty dictionary if parsing fails

    # Write formatted JSON data to file with indentation
    with open(file_path, "w") as json_file:
        json.dump(data_formatted, json_file, indent=4)


# Function to scan a folder and get file paths
def scan_folder(folder_path):
    file_paths = []
    for root, files in os.walk(folder_path):
        for file in files:
            file_paths.append(os.path.join(root, file))
    return file_paths

# Function to calculate similarity between two strings
def similarity(a, b):
    return SequenceMatcher(None, str(a), str(b)).ratio()

number_of_tests = None

# Function to compare JSON files and calculate similarity
def compare_json_file_path(json_file_path: List[str], template_file, result_file):
    # Initialize results dictionary
    results = {}
    # Initialize the number of tests
    number_of_tests = 0

    # Iterate over each file path in the list
    for file1 in json_file_path:
        number_of_tests += 1  # Increment the test counter

        # Open current JSON file and template file
        with open(file1, 'r') as f1, open(template_file, 'r') as f2:
            # Load JSON data from files
            data1 = json.load(f1)
            dataGoodResponse = json.load(f2)

            # Iterate over keys common to both JSON files
            for key in set(data1.keys()).intersection(dataGoodResponse.keys()):
                # Print key and corresponding values from both files
                print(key, data1[key], dataGoodResponse[key])

                # Check if key exists in both JSON files
                if key in data1 and key in dataGoodResponse:
                    # Calculate similarity score between values
                    if isinstance(data1[key], str) and data1[key] != "None":
                            similarity_score = round(similarity(isinstance(data1[key], str), dataGoodResponse[key]) * 100, 2)
                    else:
                        similarity_score = int(round(similarity(data1[key], dataGoodResponse[key]) * 100, 2))

                    # Update results dictionary with similarity score
                    if key in results:
                        results[key] += similarity_score
                    else:
                        results[key] = similarity_score
                else:
                    # If key is not found in one of the files, print an error message
                    print("\n\nKey not found in one of the two files"+ key+"\n\n")
                    results[key] += 0  # Increment the result with 0 for the missing key

    # Calculate the average similarity score
    if number_of_tests > 0:
        for key in results:
            results[key] /= number_of_tests

    # Write the results to the result file
    with open(result_file, 'w') as f:
        json.dump(results, f, indent=4)  # Write results in a formatted JSON



model = GenerativeModel("gemini-1.0-pro-vision-001")
projectinit=vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")

# Example usage:
# print("----------------- sunshine_mix -----------------")
# baseQuestions = {}
# baseQuestions = generate_request('company_image_folder\\sunshine_mix', model, projectinit, "Original_question", None)
# baseQuestions = generate_request('company_image_folder\\sunshine_mix', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = {}
# baseQuestions = generate_request('company_image_folder\\sunshine_mix', model, projectinit, "Modified_question", None)
# baseQuestions = generate_request('company_image_folder\\sunshine_mix', model, projectinit, "Modified_question",baseQuestions)
# baseQuestions = {}

# Example comparison:
# parent_folder_path = os.path.abspath("tests\\test_result\\original_question\\sunshine_mix")
# paths=scan_folder(parent_folder_path
# compare_json_file_path(paths, "tests\\responses\\response_sunshine_mix.json", "results_sunshinemix_original_question_comparision%test.json" )

# parent_folder_path = os.path.abspath("tests\\tests_result\\modified_question\\sunshine_mix")
# paths=scan_folder(parent_folder_path)
# compare_json_file_path(paths, "tests\\responses\\response_sunshine_mix.json", "results_sunshinemix_modified_question_comparision%test.json" )
