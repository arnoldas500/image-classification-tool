import os
import sqlite3
import shutil
import json

with open("config.json") as config_file:
    config = json.load(config_file)
    config_file.close()

db = sqlite3.connect('images.db')

for classifier in config['classes']:
    os.mkdir(f'./images/{classifier}')

    curr = db.cursor()
    curr.execute('SELECT name FROM images WHERE class=?', (classifier,))

    for file in curr.fetchall():
        try:
            shutil.move(f"./images/{file[0]}", f"./images/{classifier}/{file[0]}")
        except:
            print(f"File move error: {file[0]}")

    curr.close()

db.close()