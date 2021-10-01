const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3300
const HOST = process.env.HOST

const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

const {
    body,
    validationResult
} = require('express-validator');

app.get("/", async (req, res) => {
    try {
        const result = await prisma.employee.findMany();
        res.json(result);
    } catch (err) {
        res.json({
            "Success": false,
            "Error": true,
            "Error Message": `${err}`
        })
    }
});

app.post("/addEmployee",
    body('name').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email,
            name
        } = req.body;
        try {
            const isExists = await prisma.employee.findUnique({
                where: {
                    email: String(email)
                },
            });
            console.log("Exist value", isExists);

            if (isExists) {
                res.status(400).json({
                    "success": false,
                    "error": true,
                    "msg": 'Employee with email is already exists.'
                });
            } else {
                const result = await prisma.employee.create({
                    data: {
                        email: email,
                        name: name
                    }
                });
                console.log(result);
                if (result) {
                    res.json({
                        'success': true,
                        'error': false,
                        'msg': `Employee successfully added`
                    })
                }

            }
        } catch (error) {
            console.log("Error : ", error);
        }
    });

app.put("/updateEmployee", async (req, res) => {
    const {
        id,
        name,
        email,
    } = req.body;
    try{
        const exists = await prisma.employee.findUnique({
            where: {
                id: Number(id)
            }
        });       
        if(exists){
        const result = await prisma.employee.update(
            {
                where: {
                    id: Number(id)
                },
                data:{
                    published: !exists.published
                }
            }
        );
        res.send(result);   
     }
    }catch(error){
         
    }
});

app.get("/employee/:id", async (req, res) => {

    const {
        id
    } = req.params;

    try {
        const result = await prisma.employee.findUnique({
            where: {
                id: Number(id)
            }
        })
        res.send(result);
    } catch (err) {

    }
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(`Server Error : ${err}`);
    }
    console.log(`Server is running on port ${PORT}`);
});