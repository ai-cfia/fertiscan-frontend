import datetime
import json
import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
import pandas as pd
from difflib import SequenceMatcher
from typing import List

TYPE_OF_QUESTION = "Original_question"
QUESTION_TYPE = "Original_question"
FIRST_REQUEST = True

PROPERTIES = {
        "is_fertilizer": "fertiliser",
        "is_supplement": "supplement",
        "is_seed": "seed",
        "is_tank_mixing": "tank mixing",
        "is_mixture_product": "mixture product",

        "contain_pesticide": "pesticide",
        "contain_microorganism": "microorganism",
        "contain_organic_matter": "organic matter",
        "contain_phosphate": "phosphate",
        "contain_micronutrient": "micronutrient",
        "contain_nutrient": "nutrient",
        "contain_growing_medium": "growing medium",
        "contain_allergen": "allergen",
        "contain_acronyms": "acronyms",
        "contain_polymeric": "polymeric"
}

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
def add_text(request, properties, base_questions=None):
    if base_questions is None:
        request.append(create_base_request(read_csv_file("base_composition_questions.csv")))
    else:
        request.append(create_final_request(read_csv_file("questions_spreadsheet.csv"), base_questions, properties))
    return request

# Function to generate a request
def generate_request(directory, model:GenerativeModel, vertex:vertexai, choice_of_questions, properties, base_questions=None):
    global TYPE_OF_QUESTION
    global first_request
    TYPE_OF_QUESTION = choice_of_questions
    request = get_list_image(collect_images(directory))
    if base_questions is None:
        request = add_text(request, properties)
    else:
        request = add_text(request, properties, base_questions)
    answers = model.generate_content(request,
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

    if not first_request:
        result_to_json_file(answers.text, directory)
        first_request = True
    else:
        # Extract JSON content from raw text
        answer = answers.text
        start_index = answer.find('{')
        end_index = answer.rfind('}') + 1
        json_content = answer[start_index:end_index]
        # Parse JSON
        base_questions = json.loads(json_content)
        first_request = False
    return base_questions

# Function to convert answer to dictionary
def to_dict(answers, base_questions):
    answer_as_dict = {}
    if base_questions is None:
        for answer in answers:
            text = answer
            indice = text.find(":")
            test_before = text[:indice]
            test_after = text[indice + 1:]
            answer_as_dict[test_before] = test_after
    return answer_as_dict

# Function to read CSV file
def read_csv_file(file_path):
    # Read csv file
    df = pd.read_csv(file_path, sep=';')
    return df

# Function to create base request
def create_base_request(file):
    request_as_text = ""
    for index, line in file.iterrows():
        if not line.isnull().all():
            specification = line['Specification']
            request_as_text += str(specification) + "\n"

        line_text = str(line['Key']) + ":" + str(line['Question']) + "; \n"
        request_as_text += line_text
    return request_as_text

# Function to create final request
def create_final_request(file, base_questions, properties):
    request_as_text = ""

    for _, line in file.iterrows():
        if not line.isnull().all():
            categorie = str(line['Categories'])

            if line['Specification'] is not None:
                request_as_text += str(line['Specification']) + "\n"

            if line['Categories'] is not None:
                if "all" in categorie:
                    request_as_text = add_line(request_as_text, line)

                for key, value in properties.items():
                    if key in base_questions and value in categorie:
                        request_as_text = add_line(request_as_text, line)

    base_questions = None
    return request_as_text

# Function to add a line to the request
def add_line(request_as_text, line):
    global TYPE_OF_QUESTION
    if not line.isnull().all():
        line_text = str(line['Key']) + ":" + str(line[TYPE_OF_QUESTION]) + "\n"
        request_as_text += line_text
    return request_as_text

# Function to write results to a JSON file
def result_to_json_file(answers, directory):
    global TYPE_OF_QUESTION  # Using global variable TYPEOFQUESTION
    last_index = directory.rfind('/')
    image_name = directory[last_index+1:]
    image_name = image_name.split(".")[0].lower()
    date_time  = datetime.datetime.now().strftime("%Y-%m-%d_%Hh%Mm%Ss")  # Get current date and time
    if TYPE_OF_QUESTION == "Original_question":
        # Define folder path based on the type of question
        folder_path = f"tests/tests_result/original_question/{image_name}"
    else:
        folder_path = f"tests/tests_result/modified_question/{image_name}"

    # Create folder if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    # Define file path using image name and current date-time
    file_path = os.path.join(folder_path, f"{date_time}_result.json")

    # Extract JSON content from raw text answer
    start_index = answers.find('{')
    end_index = answers.rfind('}') + 1
    json_content = answers[start_index:end_index]

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
            data_good_answer = json.load(f2)

            # Iterate over keys common to both JSON files
            for key in set(data1.keys()).intersection(data_good_answer.keys()):
                # Print key and corresponding values from both files
                print(key, data1[key], data_good_answer[key])

                # Check if key exists in both JSON files
                if key in data1 and key in data_good_answer:
                    # Calculate similarity score between values
                    if isinstance(data1[key], str) and data1[key] != "None":
                            similarity_score = round(similarity(isinstance(data1[key], str), data_good_answer[key]) * 100, 2)
                    else:
                        similarity_score = int(round(similarity(data1[key], data_good_answer[key]) * 100, 2))

                    # Update results dictionary with similarity score
                    if key in results:
                        results[key] += similarity_score
                    else:
                        results[key] = similarity_score
                else:
                    # If key is not found in one of the files, print an error message
                    print("\n\nKey not found in one of the two files"+ key+"\n\n")
                    results[key] += 1  # Increment the result with 0 for the missing key

    # Calculate the average similarity score
    if number_of_tests > 0:
        for key in results:
            results[key] /= number_of_tests

    # Write the results to the result file
    with open(result_file, 'w') as f:
        json.dump(results, f, indent=4)  # Write results in a formatted JSON

def main():
    model = GenerativeModel("gemini-1.0-pro-vision-001")
    projectinit=vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")

    # Example usage:
    print("----------------- sunshine_mix -----------------")
    base_questions = {}
    base_questions = generate_request('company_image_folder/sunshine_mix', model, projectinit, "Original_question", PROPERTIES)
    base_questions = generate_request('company_image_folder/sunshine_mix', model, projectinit, "Original_question", PROPERTIES, base_questions)
    base_questions = {}
    base_questions = generate_request('company_image_folder/sunshine_mix', model, projectinit, "Modified_question", PROPERTIES)
    base_questions = generate_request('company_image_folder/sunshine_mix', model, projectinit, "Modified_question", PROPERTIES, base_questions)
    base_questions = {}

    # Example comparison:
    # parent_folder_path = os.path.abspath("tests/test_resultoriginal_question/sunshine_mix")
    # paths=scan_folder(parent_folder_path
    # compare_json_file_path(paths, "tests/answers/answer_sunshine_mix.json", "results_sunshinemix_original_question_comparision%test.json" )

    # parent_folder_path = os.path.abspath("tests/tests_result/modified_question/sunshine_mix")
    # paths=scan_folder(parent_folder_path)
    # compare_json_file_path(paths, "tests/answers/answer_sunshine_mix.json", "results_sunshinemix_modified_question_comparision%test.json" )

if __name__ == "__main__":
    main()
