import json
import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models

imageList = None

class app:


    def __init__(self):
        self.imageList = {}
        self.numberFolder=0
        print("-------------------------------------------------------------------------")
        print("App started")
        print("-------------------------------------------------------------------------")

    def list_files_and_directories(self, dir_path):
        self.numberFolder=0
        numberFileTotal=0
        for root, dirs, files in os.walk(dir_path):
            self.numberFolder+=1
            numberFile=0
            self.imageList[self.numberFolder] = {}
            for name in files:
                try:
                    with open(os.path.join(root, name), "rb") as img_file:
                        image_data = img_file.read()
                        numberFile+=1
                        numberFileTotal+=1
                        self.imageList[self.numberFolder][numberFile] = image_data
                except FileNotFoundError:
                    print("Le fichier spécifié n'a pas été trouvé.")
        
        print("\n-------------------------------------------------------------------------")
        print("Image transfer completed")
        print("-------------------------------------------------------------------------")

        print("\nFile loaded --> " + "\nNumber of folder: " + str(self.numberFolder) + "\nNumber of file: " + str(numberFileTotal))

    def get_number_folder(self):
        return self.numberFolder

    def get_image_list(self):
        return self.imageList

    def generateRequest(self, folder):
        vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")
        model = GenerativeModel("gemini-1.0-pro-vision-001")

        # Créer une liste pour stocker les Parts
        parts = []

        # Ajouter chaque image comme une Part distincte
        for image_data in self.imageList[folder].values():
            if image_data.endswith(".jpg") or image.endswith(".jpeg"):
                parts.append(Part.from_data(data=self.imageList[folder][image], mime_type="image/jpeg"))
            elif image_data.endswith(".png"):
                parts.append(Part.from_data(data=self.imageList[folder][image], mime_type="image/png"))

        # Lire le texte à partir du fichier
        with open("keys_questions.txt", 'r', encoding='utf-8') as file:
            text = file.read()

        # Ajouter le texte comme une autre Part
        # parts.append(Part.from_data(data=text, mime_type="text/plain"))
        parts.append(text)

        # Passer toutes les Parts à generate_content
        responses = model.generate_content(parts,
            generation_config={
            "max_output_tokens": 2048,
            "temperature": 0,
            "top_p": 1,
            "top_k": 32
            },
            safety_settings={
                generative_models.HarmCategory.HARM_CATEGORY_HATE_SPEECH: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                generative_models.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                generative_models.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                generative_models.HarmCategory.HARM_CATEGORY_HARASSMENT: generative_models.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            stream=True,
        )    
        for response in responses:
            if response.text!=None:
                line = response.text 
                print(line)
        else:
            print("No parts in this content.")

         
        #response = model.generate_content([image_Part, merge_keys_and_questions("keys.json", "questions.json")])

"""     def merge_keys_and_questions(self, key_file_path, question_file_path):
        # Load JSON data from key and question files
        with open(key_file_path, 'r', encoding='utf-8') as key_file:
            keys_data = json.load(key_file)
        with open(question_file_path, 'r', encoding='utf-8') as question_file:
            questions_data = json.load(question_file)
        temp_data = {}
        for key, question in questions_data.items():
            temp_data[key] = question
            
        for key, value in temp_data.items():
            print(f"Key : {key}, Question : {value}")
        return temp_data """
        
my_app = app()
my_app.list_files_and_directories('Company_Image_Folder')
my_app.generateRequest(1)

# Path: app.py