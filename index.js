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


//function for validation
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

const commonResponse = {
    success: true,
    error: false,
    msg: null,
    statusCode: null
}

//get all employees on base route
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

// add a employee
app.post("/addEmployee",
    validate([
        body('name').not().isEmpty().trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('deptId').not().isEmpty()
    ]), async (req, res) => {
        const {
            email,
            name,
            deptId
        } = req.body;

        try {
            const isDeptExists = await prisma.department.findUnique({
                where: {
                    id: Number(deptId)
                }
            });
            if (isDeptExists === null) {
                res.status(400).json({
                    "msg": "Department with given code is not exists."
                });
            }
            const isExists = await prisma.employee.findUnique({
                where: {
                    email: String(email)
                },
            });

            if (isExists) {
                res.status(400).json({
                    "success": false,
                    "error": true,
                    "msg": 'Employee with email is already exists.'
                });
            } else if (isDeptExists && !isExists) {
                const result = await prisma.employee.create({
                    data: {
                        email: email,
                        name: name,
                        deptId: deptId
                    }
                });



                if (result) {
                    res.json({
                        ...commonResponse,
                        msg: `Employee successfully added`,
                        statusCode: 200,
                        statusMsg: 'Ok'
                    })
                }
            }
            else {


                res.json({
                    ...commonResponse,
                    success: false,
                    error: true,
                    msg: "Server Error"
                })
            }
        } catch (error) {
            console.log("Error : ", error);
        }
    });

//update a employee details
app.put("/updateEmployee", async (req, res) => {
    const {
        id,
        name,
        email,
    } = req.body;

    try {
        const exists = await prisma.employee.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (exists) {
            const data = {
                ...exists,
                name: name,
                email: email
            };

            const result = await prisma.employee.update(
                {
                    where: {
                        id: Number(id)
                    },
                    data: data
                }
            );
            res.send(result);
        }
    } catch (error) {

    }
});


//delete employee by id
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

    res.status(200).json({
        success: true,
        error: false
    });
});

//get employee by id using params
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

// get employee by full name 
app.get("/getEmployeeByName", async (req, res) => {
    const { name } = req.query;

    const result = await prisma.$queryRaw`SELECT name,email FROM "Employee" WHERE name = ${name}`;
    // const result = await prisma.employee.findFirst({
    //     where:{
    //         name: String(name)
    //     }
    // });
    res.send(result);
});

// get employee by id  using query
app.get("/getEmployeeById", async (req, res) => {
    const { id } = req.query;
    //const result = await prisma.$queryRaw`SELECT name,email FROM "Employee" WHERE id = ${id}`;
    const result = await prisma.employee.findUnique({
        where: {
            id: Number(id)
        }
    });
    res.send(result);
})

// get all employees with /getEmployees route
app.get("/getEmployees", async (req, res) => {
    const result = await prisma.$queryRaw`SELECT * FROM "employee"`;
    res.send(result);
}
);

/* 
serach with a give specific value
*/
app.get("/search", async (req, res) => {
    const { searchField } = req.body;
    const result = await prisma.employee.findMany({
        where: {
            OR: [{
                name: {
                    startsWith: searchField
                }
            }]
        }
    });
    res.send(result);
});


//add a department
app.post("/addDepartment", async (req, res) => {
    const { name } = req.body;
    try {
        const result = await prisma.department.create({
            data: {
                name: name
            }
        });
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});

//get all departments
app.get('/departments', async (req, res) => {
    const result = await prisma.department.findMany();
    res.send(result);
})

/* handle request on port 3300
 */
app.listen(PORT, (err) => {
    if (err) {
        console.log(`Server Error : ${err}`);
    }
    console.log(`Server is running on port ${PORT}`);
});