const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const sequilize = require('./database');
const authRoute = require('./routes/usersRouter');
const surveyRoute = require('./routes/surveyRouter');
const imageRoute = require('./routes/imageRouter');


//  Creating Express App and PORT no
const app = express();
const PORT = process.env.PORT || 3000;


//  Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
dotenv.config({ path: './config/.env' });

// Using multer to handle file upload
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        /*Appending extension with original name*/
        cb(null, file.originalname + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage });


//  Connecting to Database
sequilize.sync().then(() => console.log("Database Connected"));

//  Routes
app.get('/', (req, res) => res.sendFile("index.html"));
app.use('/user', authRoute);
app.use('/survey', surveyRoute);
app.use('/image', upload.single('image'), imageRoute);

app.listen(PORT, () => console.log("App is running!"));