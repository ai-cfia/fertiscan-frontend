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
                        print(f"Image: {name} - Taille: {len(image_data)} octets")  
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
        image_Part = []
        vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")
        model = GenerativeModel("gemini-1.0-pro-vision-001")

        for image in self.imageList[folder]:
            if(image.endswith(".jpg") or image.endswith(".jpeg")):
                image_Part.append(Part.from_data(data=self.imageList[folder][image]), mime_type="image/jpeg")
            elif image.endswith(".png"):
                image_Part.append(Part.from_data(data=self.imageList[folder][image], mime_type="image/png"))
        self.merge_keys_and_questions("keys.json", "questions.json")
        # response = model.generate_content([image_Part, merge_keys_and_questions("keys.json", "questions.json")])

    def merge_keys_and_questions(self, key_file_path, question_file_path):
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
        return temp_data
        
my_app = app()
my_app.list_files_and_directories('Company_Image_Folder')
my_app.generateRequest(1)

# Path: app.py