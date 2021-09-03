const express = require('express');
const app = express();
const port = 9995;

let fs = require( 'fs' );
let path = require( 'path' );
const checkpoint_path = './images/.ipynb_checkpoints'
const img_path = './images'
const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('images.db');


async function setup(){
    
    //delete .ipynb_checkpoints from images since not an image
    //fs.rmdirSync(dir, { recursive: true });
    try {
      fs.rmdirSync(checkpoint_path, { recursive: true })
        console.log('.ipynb_checkpoints removed')
    } catch(err) {
      console.warn(err)
    }
    
    await db.run('CREATE TABLE IF NOT EXISTS images (name TEXT UNIQUE, class TEXT, classified BOOLEAN);', (result, err)=> {
        if (err){
            throw err;
        }
        else {
            fs.readdir(img_path, (err, files) => {
                if (err){
                    throw err;
                }
                else {
                    for (let file of files){
                        db.run('INSERT INTO images (name, classified) VALUES (?, ?)', [file, false], (result, err) => {
                            if(err){
                                console.log(`DB Initialization Error: ${err}`)
                            }
                        });
                    }
                }
            });
        }
    });
}

if (!fs.existsSync('./images.db')){
    setup();
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/images', express.static('images'));

let config_file = fs.readFileSync('config.json');
let config = JSON.parse(config_file);
let img_list = []

var count = 0;

app.get('/', (req, res) => {
    db.get('SELECT name FROM images WHERE classified = 0 LIMIT 1', (err, result) => {
        if (err) {
            res.send(err);
        }
        else if (result) {
            console.log("image i am seeing ", result)
            if(count == 0){
                res.render('index.html', {image: result['name'], classes: [ 'Snow', 'Rain', 'IDK' ]});
                
                console.log(config.classes)
            }else{
                res.render('index.html', {image: result['name'], classes: config.classes});
            }
            
            
        }
        else {
            res.render('none.html', {})
        }
    });
})

// app.post('/:image/:className', (req, res) =>{
//     console.log(req.params.image + ":" + req.params.className);

//     db.run('UPDATE images SET class = ?, classified = ? WHERE name = ?',
//     [req.params.className, true, req.params.image]);

//     res.redirect('/');
// });

app.post('/:image/:className', (req, res) =>{
//     console.log(req.params.image + ":" + req.params.className + " count "+ count);
//      console.log(req.params['start'])
//     console.log(req.params.prev)
    img_list.push(req.params.image)
    
//     var last = img_list.pop()
//     console.log("last ", last)
    //maybe try to pop the elemnt and pass the item beffore to below if undo is pressed
    if(req.params.className == "UNDO"){
        count--;
        console.log("Undo called")
        db.run('UPDATE images SET class = ?, classified = ? WHERE name = ?',
        [req.params.className, false, img_list[count]]);
//         db.run('UPDATE images SET class = ?, classified = ? WHERE name = ?',
//         [req.params.className, false, req.params.image]);
        res.redirect('/');
    }else{
        count++;
        db.run('UPDATE images SET class = ?, classified = ? WHERE name = ?',
        [req.params.className, true, req.params.image]);
        res.redirect('/');
    }
    console.log("image label and count after", img_list[count],req.params.image, req.params.className, count )

//     res.redirect('/');
});


app.listen(port);
