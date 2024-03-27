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

    def collect_images(self,directory):
        image_extensions = [".jpg", ".jpeg", ".png"]
        image_paths = []

        for root, dirs, files in os.walk(directory):
            for file in files:
                if any(file.endswith(ext) for ext in image_extensions):
                    image_paths.append(os.path.join(root, file))

        return image_paths

    def generateRequest(self, directory):
        imageListPath = self.collect_images(directory)
        vertexai.init(project="test-application-2-416219", location="northamerica-northeast1")
        model = GenerativeModel("gemini-1.0-pro-vision-001")

        imagesList = []

        for image_data in imageListPath:
            with open(image_data, 'rb') as f:
                image_data = f.read()
                imagesList.append(Part.from_data(data=image_data, mime_type="image/jpeg"))

        with open("keys_questions.txt", 'r', encoding='utf-8') as file:
            text = file.read()

        imagesList.append(text)

        response = model.generate_content(imagesList,
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
            stream=False,
        )    
        print(response.text)        

         
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
my_app.generateRequest('Company_Image_Folder\Acti_Sol1')