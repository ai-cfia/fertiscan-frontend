import datetime
import json
import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
import pandas as pd

typeOfQuestion = "Original_question"

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
    if baseQuestions != None:
        result_to_jsonFile(responses.text, directory) 
    if baseQuestions == None:
        baseQuestions = toDict(responses.text)
    
    return baseQuestions

def toDict(responses, baseQuestions=None):
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

                if "fertilizer" in categorie and "is_fertilizer" in baseQuestions:

                    if "pesticide" in categorie and "contain_pesticide" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "seed" in categorie and "is_seed" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)
                    
                    if "tank_mixing" in categorie and "is_tank_mixing" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)
                    
                    if "microorganism" in categorie and "contain_microorganism" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "organic_matter" in categorie and "contain_organic_matter" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "phosphate" in categorie & "contain_phosphate" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "micronutrient" in categorie & "contain_micronutrient" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "nutrient" in categorie & "contain_nutrient" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                elif "supplement" in categorie and "is_supplement" in baseQuestions:

                    if "pesticide" in categorie & "contain_pesticide" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "seed" in categorie & "is_seed" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)
                    
                    if "tank_mixing" in categorie & "is_tank_mixing" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)
                    
                    if "microorganism" in categorie & "contain_microorganism" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "organic_matter" in categorie & "contain_organic_matter" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "micronutrient" in categorie & "contain_micronutrient" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "nutrient" in categorie & "contain_nutrient" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                    if "microorganism_group" in categorie and "contain_microorganism" in baseQuestions:
                        request_AsText = addLine(request_AsText, line)

                elif "growing_medium" in categorie and "contain_growing_medium" in baseQuestions:
                    request_AsText = addLine(request_AsText, line)

                if "mixture_product" in categorie and "is_mixture_product" in baseQuestions:
                    request_AsText = addLine(request_AsText, line)
                if "allergen" in categorie and "contain_allergen" in baseQuestions:
                    request_AsText = addLine(request_AsText, line)
                if "acronyms" in categorie and "contain_acronyms" in baseQuestions:
                    request_AsText = addLine(request_AsText, line)
                if "polymeric" in categorie and "contain_polymeric" in baseQuestions:
                    request_AsText = addLine(request_AsText, line)         
    return request_AsText
                

def addLine(requestAsText, line):
    global typeOfQuestion
    if not line.isnull().all():
        line_text = str(line['Key']) + ":" + str(line[typeOfQuestion]) + "\n"
        requestAsText += line_text
    return requestAsText

def result_to_jsonFile(data, directory):
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
    file_path = os.path.join(folder_path, f"Test_{date_time}.json")
    with open(file_path, "w") as json_file:
        json.dump(data, json_file, indent=4)
    
def get_all_json_test_file(parent_folder_path=None):

   import os

def get_all_json_test_file(parent_folder_path=None):
    if parent_folder_path is None:
        # Chemin absolu du dossier parent
        parent_folder_path = os.path.abspath("Tests\\TestsResult")
    
    # Liste pour stocker tous les fichiers
    all_files = []
    
    # Traverse chaque sous-dossier dans le dossier parent
    for root, dirs, files in os.walk(parent_folder_path):
        # Liste des fichiers JSON dans le sous-dossier actuel
        json_files = [os.path.relpath(os.path.join(root, file), "Tests\\") 
                      for file in files if file.endswith('.json')]
        
        # Ajoute les fichiers JSON à la liste de tous les fichiers
        all_files.extend(json_files)
        
        # Appel récursif pour obtenir les fichiers JSON dans les sous-sous-dossiers
        for dir in dirs:
            subdir_path = os.path.join(root, dir)
            all_files.extend(get_all_json_test_file(subdir_path))
        
        # Arrête la boucle pour éviter de traverser davantage dans les sous-dossiers
        break
        
    return all_files

# Chemin absolu du dossier parent
parent_folder_path = os.path.abspath("Tests\\TestsResult")

# Obtient tous les fichiers JSON de test dans le dossier spécifié et ses sous-dossiers
files = get_all_json_test_file(parent_folder_path)

# Affiche les chemins de tous les fichiers JSON
print("Tous les fichiers JSON de test dans le dossier TestResult et ses sous-dossiers:")
for file in files:
    print(file)

         

 
model = GenerativeModel("gemini-1.0-pro-vision-001")
projectinit=vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")
# print("----------------- Acti_Sol1 -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, "Modified_question",baseQuestions)

# print("----------------- Acti_Sol2 -----------------")
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Original_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Original_question", baseQuestions)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Modified_question", None)
# baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol2', model, projectinit, "Modified_question", baseQuestions)

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

get_all_json_test_file()