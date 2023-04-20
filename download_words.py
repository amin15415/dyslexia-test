# %%
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests

# %%
extra_words = ['call', 'does', 'meadow', 'intrigue', 'bridge', 'endeavor', 'islet', 'demagogue', 'malapropos', 'monocotyledon']
words = [
            'father', 'could', 'know', 'money',         'funny', 'there',
                    'listen', 'city', 'animal', 'light', 'uncle', 'rolled',
            'calf', 'enough',      
            'heavy', 'business', 'believe', 'laugh',
            'delight', 'familiar', 'rough', 'glisten', 'league', 'spectacles', 'decorate',
            'cautious', 'ancient', 'toughen', 'height', 'doubt', 'position', 'contagious',
            'conceited', 'foreign', 'knapsack', 'decisions', 'allegiance', 'leisure', 'deny',
            'dominion',      
            'aeronautic', 'trudge', 'tomorrow', 'graciously',
            'pollute', 'exonerate', 'risible', 'regime', 
            'heinous',
            'parliament', 'gnostic', 'mannequin', 'homologous', 'prerequisite', 'rhapsody', 'euphony',
            'litigious', 'tincture', 'oligarchy', 'inefficacious', 
            'parturition', 'mimicry',
            'homeopathy', 'evanesce', 'geodesy', 'coulomb', 'zoophyte', 'execrable', 'triptych',
            'sobriquet', 'deliquesce', 'colloquy', 'vitiate', 'sycophant', 'intermezzo', 'dehiscence',
            'exiguous', 
            'ytterbium', 'leitmotif', 'egregious', 'legerdemain'  
        ]
# %%
options = webdriver.ChromeOptions()
options.add_argument('--headless')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# %%
for word in words:
    print(word)
    driver.get(f"https://www.google.com/search?q=how+to+pronounce+{word}")
    audio = WebDriverWait(driver, timeout=12).until(lambda x: x.find_element(By.TAG_NAME,"AUDIO"))
    src = requests.get(audio.get_attribute('src'))
    with open(f'./src/assets/audio/{word}.mp3', 'wb') as f:
        f.write(src.content)

# %%
for word in extra_words:
    print(word)
    src = requests.get(f"https://ssl.gstatic.com/dictionary/static/sounds/20220808/{word}--_us_1.mp3")
    with open(f'./src/assets/audio/{word}.mp3', 'wb') as f:
        f.write(src.content)
# %%
# for word in extra_words:
#     driver.get(f"https://www.dictionary.com/browse/{word}")
#     audio = WebDriverWait(driver, 12).until(EC.presence_of_element_located((By.XPATH,"//*[@type='audio/mpeg']")))
#     src = requests.get(audio.get_attribute('src'))
#     with open(f'./src/assets/audio/{word}.mp3', 'wb') as f:
#         f.write(src.content)