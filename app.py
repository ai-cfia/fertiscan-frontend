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

my_app = app()
my_app.list_files_and_directories('Company_Image_Folder')

# Path: app.py