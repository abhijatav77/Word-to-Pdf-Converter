const express = require("express")
const multer = require('multer')
const docxToPDF = require('docx-pdf')
const path = require('path')
const cors = require('cors')

const app = express()
const port = 3000;

app.use(cors())

// Setting up the file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post('/convertfile', upload.single('file'), (req, res, next) => {
    try {
        if(!req.file){
            return res.status(400).json({
                message: "No file uploaded!"
            })
        }

        // Defining output file path
        let outputPath = path.join(__dirname,"files", `${req.file.originalname}.pdf`)

        docxToPDF(req.file.path, outputPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    message: "Erro converting docs to pdf"
                })
            }
            res.download(outputPath, () => {
                console.log("File downloaded successfully")
            })
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server listening on port no. ${port}`)
})