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
import itertools
from typing import List




typeOfQuestion = "Original_question"
firstRequest = True

def collect_images(directory):
    image_extensions = [".jpg", ".jpeg", ".png"]
    image_paths = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in image_extensions):
                image_paths.append(os.path.join(root, file))
    return image_paths

def getListImage(image_paths):
    request = []
    for image_data in image_paths:
        with open(image_data, 'rb') as f:
            image = f.read()
            request.append(Part.from_data(data=image, mime_type="image/jpeg"))
            
    return request

def addText(request, baseQuestions=None):
    if baseQuestions == None:
        request.append(create_base_request(read_csv_file("base_composition_questions.csv")))
    else:  
        request.append(create_final_request(read_csv_file("questions_spreadsheet.csv"), baseQuestions))

    return request

def generateRequest(directory, model:GenerativeModel, vertex:vertexai, choiceOfQuestions, baseQuestions=None):
    global typeOfQuestion
    global firstRequest
    typeOfQuestion = choiceOfQuestions
    request = getListImage(collect_images(directory))
    if baseQuestions == None:
        request = addText(request, None)
    else:
        request = addText(request, baseQuestions)
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
        result_to_jsonFile(responses.text, directory) 
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
    print(responses.text)
    return baseQuestions

def toDict(responses, baseQuestions):
    responseAsDict = {}
    if baseQuestions == None: 
        for response in responses:
            texte = response
            indice = texte.find(":")
            partie_avant = texte[:indice]
            
            partie_apres = texte[indice + 1:]
            responseAsDict[partie_avant] = partie_apres
    return responseAsDict

def read_csv_file(file_path):
    # Lire le fichier CSV
    df = pd.read_csv(file_path, sep=';')
    return df


def create_base_request(file):
    requestAsText = ""
    for index, line in file.iterrows():
        if not line.isnull().all():
            specification = line['Specification']
            requestAsText += str(specification) + "\n"
        
        line_text = str(line['Key']) + ":" + str(line['Question']) + "; \n"
        requestAsText += line_text
    return requestAsText

def  create_final_request(file, baseQuestions):
    request_AsText = ""
    for index, line in file.iterrows():
        if not line.isnull().all():
            categorie = str(line['Categories'])

            if line['Specification'] != None:
                request_AsText += str(line['Specification']) + "\n"

            if line['Categories'] != None:
                if "all" in categorie:
                    request_AsText = addLine(request_AsText, line)
                
                if  "fertilizer"in categorie and"is_fertilizer" in baseQuestions:
                    if "contain_pesticide" in baseQuestions:
                        if "pesticide" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "is_seed" in baseQuestions:
                        if "seed" in categorie:
                            request_AsText = addLine(request_AsText, line)
                    
                    if "is_tank_mixing" in baseQuestions:
                        if "tank_mixing" in categorie:
                            request_AsText = addLine(request_AsText, line)
                    
                    if "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie :
                            request_AsText = addLine(request_AsText, line)

                    if "contain_organic_matter" in baseQuestions:
                        if "organic_matter" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "contain_phosphate" in baseQuestions:
                        if "phosphate" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "contain_micronutrient" in baseQuestions:
                        if "micronutrient" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "contain_nutrient" in baseQuestions:
                        if "nutrient" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if  "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie:
                            request_AsText = addLine(request_AsText, line)

                elif "supplement" in categorie and "is_supplement" in baseQuestions:

                    if "contain_pesticide" in baseQuestions:
                        if "pesticide" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "is_seed" in baseQuestions:
                        if "seed" in categorie:
                            request_AsText = addLine(request_AsText, line)
                    
                    if "is_tank_mixing" in baseQuestions:
                        if "tank_mixing" in categorie:
                            request_AsText = addLine(request_AsText, line)
                    
                    if "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie :
                            request_AsText = addLine(request_AsText, line)

                    if "contain_organic_matter" in baseQuestions:
                        if "organic_matter" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "contain_phosphate" in baseQuestions:
                        if "phosphate" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "contain_micronutrient" in baseQuestions:
                        if "micronutrient" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    if "contain_nutrient" in baseQuestions:
                        if "nutrient" in categorie:
                            request_AsText = addLine(request_AsText, line)
                            
                    if  "contain_microorganism" in baseQuestions:
                        if "microorganism" in categorie:
                            request_AsText = addLine(request_AsText, line)

                    

                elif "contain_growing_medium" in baseQuestions:
                    if "growing_medium" in categorie:
                        request_AsText = addLine(request_AsText, line)

                if  "is_mixture_product" in baseQuestions:
                    if "mixture_product" in categorie:
                        request_AsText = addLine(request_AsText, line)

                if "contain_allergen" in baseQuestions:
                    if "allergen" in categorie:
                        request_AsText = addLine(request_AsText, line)
                
                if "contain_acronyms" in baseQuestions:
                    if "acronyms" in categorie:
                        request_AsText = addLine(request_AsText, line)
                if "contain_polymeric" in baseQuestions:
                    if "polymeric" in categorie:
                        request_AsText = addLine(request_AsText, line)
    baseQuestions == None       
    return request_AsText
                

def addLine(requestAsText, line):
    global typeOfQuestion
    if not line.isnull().all():
        line_text = str(line['Key']) + ":" + str(line[typeOfQuestion]) + "\n"
        requestAsText += line_text
    return requestAsText



def result_to_jsonFile(responses, directory):
    global typeOfQuestion
    lastIndex = directory.rfind('\\')
    imageName = directory[lastIndex+1:]
    imageName = imageName.split(".")[0]
    date_time  = datetime.datetime.now().strftime("%Y-%m-%d_%Hh%Mm%Ss")
    if typeOfQuestion == "Original_question":
        folder_path = f"Tests\\TestsResult\\Original_question\\{imageName}"
    else:  
        folder_path = f"Tests\\TestsResult\\Modified_question\\{imageName}"
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    file_path = os.path.join(folder_path, f"{date_time}_test.json")
    
    # Extract JSON content from raw text
    start_index = responses.find('{')
    end_index = responses.rfind('}') + 1
    json_content = responses[start_index:end_index]
    print(responses)
    # Parse JSON
    data_formated = json.loads(json_content)

    # Write JSON data to file
    with open(file_path, "w") as json_file:
        json.dump(data_formated, json_file, indent=4)

    

def scan_folder(folder_path):
    file_paths = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            file_paths.append(os.path.join(root, file))
    return file_paths

def similarity(a, b):
    return SequenceMatcher(None, str(a), str(b)).ratio()

number_of_tests = None

# def compare_json_files(json_files: List[str], lastFile=None):
#     results = {}
#     global number_of_tests
#     if number_of_tests == None:
#         number_of_tests = 0

#     with open('results%Test.json', 'r') as f:
#         results = json.load(f)

#     number_of_tests = len(json_files) - 1
#     print("Comparing JSON files...")     
#     for i in range(len(json_files) - 1):
#         print(number_of_tests)
#         file1 = json_files[i]
#         file2 = json_files[i+1]
#         print("Comparing", file1, "and", file2)
#         with open(file1, 'r') as f1, open(file2, 'r') as f2:
#             data1 = json.load(f1)
#             data2 = json.load(f2)

#             for key in set(data1.keys()).intersection(data2.keys()):
#                 similarity_score = similarity(data1[key], data2[key]) * 100
#                 results[key] = (results[key]+similarity_score)
#                 if number_of_tests == len(json_files):
#                     results[key] = similarity_score/len(json_files)
#                 print(f"Similarity {key}: {results[key]}%")

#     with open('results%Test.json', 'w') as f:
#         json.dump(results, f)

def compare_json_files(json_files: List[str], response_file):
        results = {}
        global number_of_tests
        if number_of_tests == None:
            number_of_tests = 0  # Initialisation of the number of test

        # loading the old results
        try:
            with open('results_good_responses%Test.json', 'r') as f:
                results = json.load(f)
        except FileNotFoundError:
            pass

        print("Comparing JSON files...")

        for i in range(len(json_files) - 1):
            number_of_tests += 1
            file1 = json_files[i]
            print("Comparing", file1, "and", response_file)

            with open(file1, 'r') as f1, open(response_file, 'r') as f2:
                data1 = json.load(f1)
                dataGoodResponse = json.load(f2)

                for key in set(data1.keys()).intersection(dataGoodResponse.keys()):
                    if key in data1 == key in dataGoodResponse:
                        similarity_score = similarity(data1[key], dataGoodResponse[key]) * 100
                        # update results
                        if key in results:
                            results[key] += similarity_score
                        else:
                            results[key] = similarity_score
                    else:
                        print("Key not found in one of the two files")
                        #problem where the key is not in one of the two files
                        #results[key] = 100

                    # if it is the last file, calculate the average
                    if number_of_tests== len(json_files) - 1:
                        results[key] /= len(json_files) - 1
                        print(f"Similarity {key}: {results[key]}%")

        # Écriture des résultats dans le fichier JSON
        with open('results_good_responses%Test.json', 'w') as f:
            json.dump(results, f)

 
model = GenerativeModel("gemini-1.0-pro-vision-001")
projectinit=vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")
print("----------------- Acti_Sol1 -----------------")
# baseQuestions = {}
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = {}
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Modified_question",baseQuestions)
# baseQuestions = {}
# print("----------------- Acti_Sol2 -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = {}
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Modified_question", baseQuestions)
# baseQuestions = {}
# print("----------------- Agrocentre -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Agrocentre', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Agrocentre', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Agrocentre', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Agrocentre', model, projectinit, "Modified_question", baseQuestions)

# print("----------------- Bio_Fleur -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Bio_Fleur', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Bio_Fleur', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Bio_Fleur', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Bio_Fleur', model, projectinit, "Modified_question", baseQuestions)

# print("----------------- Cameron_Micronutrients -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Cameron_Micronutrients', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Cameron_Micronutrients', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Cameron_Micronutrients', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Cameron_Micronutrients', model, projectinit, "Modified_question", baseQuestions)

# print("----------------- Resilence -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Resilence', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Resilence', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Resilence', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Resilence', model, projectinit, "Modified_question", baseQuestions)

# print("----------------- Sustane -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Sustane', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Sustane', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Sustane', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Sustane', model, projectinit, "Modified_question", baseQuestions)

# print("----------------- Synagri -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Synagri', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Synagri', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Synagri', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Synagri', model, projectinit, "Modified_question", baseQuestions)

# Absolute path of the parent directory
parent_folder_path = os.path.abspath("Tests\\TestsResult\\Original_question\\Acti_Sol1")
answer_folder_path = os.path.abspath("")
paths=scan_folder(parent_folder_path)
compare_json_files(paths, "Tests\\Responses\\response_actiSol1.json" )
#print(compare_json_files_line_by_line("Tests\\TestsResult\\Original_question\\Acti_Sol1"))


# Get all the test JSON files in the specified directory and its subdirectories
#files = get_all_json_test_file(parent_folder_path)

# Display the paths of all JSON files
#print("All the JSON files in the specified directory and its subdirectories:")
#for file in files:
#    print(file)