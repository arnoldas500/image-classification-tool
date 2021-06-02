
## Usage
1. Move all your images into the `images` directory at the top level

2. Insert the classes that you'd like to classify over in the `config.json` file. Make sure you leave the "UNDO"

3. Setup the Node environment by running
    ```shell
    $> npm install --save
    ```
    *Note: If re-running npm install first delete old node mods*

4. Start the server
    ```shell
    $> node index.js
    ```
5. Open your web browser and navigate to [http://hulkIP:999*](http://hulkIP:999*)

6. (Optional) After classifying your images you can run the python script `file_mover.py` to move all images to subfolders corresponding to their classification.
    ```shell
    $> python file_mover.py
    ```
    *Note: Run this script using Python 3+*
    
    Or read the classifications directly from the SQLite3 database `images.db`

