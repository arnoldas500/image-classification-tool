import os
import sqlite3
import shutil
import json

with open("config.json") as config_file:
    config = json.load(config_file)
    config_file.close()

db = sqlite3.connect('images.db')

for classifier in config['classes']:
    dirpath = f'./images/{classifier}'
    if not os.path.exists(dirpath):
        os.mkdir(dirpath)
    else:
        print(f'directory {dirpath} already exists')

    curr = db.cursor()
    curr.execute('SELECT name FROM images WHERE class=?', (classifier,))

    for file in curr.fetchall():
        filepath = f"./images/{file[0]}"
        # we only want to move files. we don't want to move directories!
        if os.path.isfile(filepath):
            try:
                shutil.move(f"./images/{file[0]}", f"./images/{classifier}/{file[0]}")
            except:
                print(f"File move error: {file[0]}")

    curr.close()

db.close()

if len(os.listdir('./images/UNDO/')) == 0:
    print('removing empty UNDO directory')
    os.rmdir('./images/UNDO/')
else:
    print('./images/UNDO/ is not empty')
