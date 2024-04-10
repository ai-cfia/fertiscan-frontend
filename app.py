import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
import pandas as pd

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
        print(image_data)
        with open(image_data, 'rb') as f:
            image = f.read()
            request.append(Part.from_data(data=image, mime_type="image/jpeg"))
            
    return request

def addText(request, number, baseQuestions=None):
    if baseQuestions is None:
        request.append(create_base_request(read_csv_file("base_composition_questions.csv")))
    else:  
        request.append(create_final_request(read_csv_file("questions_spreadsheet.csv"), baseQuestions))

    return request

def generateRequest(directory, model:GenerativeModel, vertex:vertexai, baseQuestions=None):
    request = getListImage(collect_images(directory))
    if baseQuestions is None:
        request = addText(request, 1)
    else:
        request = addText(request, 2, baseQuestions)
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

    if baseQuestions is None:
        baseQuestions = toDict(responses.text)
    #else:
       # otherQuestion = toDict(responses, baseQuestions)
       
    print(responses.text)
    
    return baseQuestions

def toDict(responses, baseQuestions=None):
    responseAsDict = {}
    if baseQuestions is None: 
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

def  create_final_request(file, baseQuestions, typeOfQuestion):
    request_AsText = ""
    for index, line in file.iterrows():
        if not line.isnull().all():
            categorie = str(line['Categories'])
            if line['Specification'] is not None:
                request_AsText += str(line['Specification']) + "\n"

            if line['Categories'] is not None:
                if "not_asked" in categorie:
                    break
                elif "all" in categorie:
                    request_AsText = addLine(request_AsText, line, typeOfQuestion)

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

                elif "growing_medium" in categorie and "contain_growing_medium" in baseQuestions:
                    request_AsText = addLine(request_AsText, line)

                if "mixture_product" in categorie and "is_mixture_product" in baseQuestions:
                    request_AsText = addLine(request_AsText, line)
                return request_AsText
                

def addLine(requestAsText, line, typeOfQuestion):
    if not line.isnull().all():
        line_text = str(line['Key']) + ":" + str(line[typeOfQuestion]) + "\n"
        requestAsText += line_text
    return requestAsText

def create_base_request(file):
    requestAsText = ""
    for index, line in file.iterrows():
        if not line.isnull().all():
            specification = line['Specification']
            requestAsText += str(specification) + "\n"
        
        line_text = str(line['Key']) + ":" + str(line['Question']) + "; \n"
        requestAsText += line_text
    return requestAsText

    
        

 
model = GenerativeModel("gemini-1.0-pro-vision-001")
projectinit=vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")
#Original question
baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, None, "Original_question")
baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, baseQuestions, "Original_question")
# Modified question
baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, None, "Modified_question")
baseQuestions = generateRequest('Company_Image_Folder\\Acti_Sol1', model, projectinit, baseQuestions, "Modified_question")

#generateRequest('Company_Image_Folder\Bio_Fleur', model, projectinit)
#generateRequest('Company_Image_Folder\Bio_Fleur', model, projectinit)
#generateRequest('Company_Image_Folder\Bio_Fleur', model, projectinit)
