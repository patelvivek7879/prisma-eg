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

const validate = validations => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    }
}

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
    // body('name').not().isEmpty().trim().escape(),
    // body('email').isEmail().normalizeEmail(), async (req, res) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({
    //             errors: errors.array()
    //         });
    //     }
    validate([
        body('name').not().isEmpty().trim().escape(),
        body('email').isEmail().normalizeEmail()
    ]), async (req, res) => {
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

    console.log(req.body);

    try {
        const exists = await prisma.employee.findUnique({
            where: {
                id: Number(id)
            }
        });

        console.log(name + " , " + email);

        if (exists) {
            console.log("name : ", name);
            console.log({ ...exists });
            const data = {
                ...exists,
                name: name,
                email: email
            };

            console.log("Exist data : ", exists);
            console.log("for Update: ", data);

            const result = await prisma.employee.update(
                {
                    where: {
                        id: Number(id)
                    },
                    data: data
                }
            );
            console.log("Data after updation : ", result);
            res.send(result);
        }
    } catch (error) {

    }
});

app.delete("/deleteEmployee/:id", async (req, res) => {
    const { id } = req.params;

    const exists = await prisma.employee.findUnique({
        where: {
            id: Number(id)
        }
    })
    if (!exists) {
        res.send({
            success: false,
            error: true,
            msg: `Employee with id ${id} does not exists.`
        })
    }

    const result = await prisma.employee.delete({
        where: {
            id: Number(id)
        }
    });
    console.log(result);
    res.status(200).json({
        success: true,
        error: false
    });
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

app.get("/getEmployeeByName", async (req, res) => {
    const { name } = req.query;
    console.log(name);
    const result = await prisma.$queryRaw`SELECT name,email FROM "Employee" WHERE name = ${name}`;
    // const result = await prisma.employee.findFirst({
    //     where:{
    //         name: String(name)
    //     }
    // });
    console.log(result);
    res.send(result);
});

app.get("/getEmployeeById", async (req, res) => {
    const { id } = req.query;
    console.log(req.query);
    console.log(id);
    //const result = await prisma.$queryRaw`SELECT name,email FROM "Employee" WHERE id = ${id}`;
    const result = await prisma.employee.findUnique({
        where: {
            id: Number(id)
        }
    });
    res.send(result);
})

app.get("/getEmployees", async (req, res) => {
    const result = await prisma.$queryRaw`SELECT * FROM "Employee"`;
    res.send(result);
}
);

app.get("/search",async (req, res)=>{
    const { searchField } = req.body;
    const result = await prisma.employee.findMany({
        where:{
            OR:[{
                name:{
                    startsWith: searchField
                }
            }]
        }
    });
    res.send(result);
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(`Server Error : ${err}`);
    }
    console.log(`Server is running on port ${PORT}`);
});