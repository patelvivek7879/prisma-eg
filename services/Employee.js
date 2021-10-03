
const router = require("express").Router();
const validate = require("./customValidation");
const commonResponse = require("./commonResponse");
const {
    body,
    validationResult
} = require('express-validator');
const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

//get all employees on base route
router.get("/", async (req, res) => {
    try {
        const result = await prisma.employee.findMany();
        console.log(result);
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
router.post("/addEmployee",
    validate([
        body('name').not().isEmpty().trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('deptId').not().isEmpty()
    ]), async (req, res) => {
        const {
            email,
            name,
            deptId, 
            age
        } = req.body;

        try {
            const isEmployeeExists = await prisma.employee.findUnique({
                where: {
                    email: String(email)
                },
            });
            const deptExists = await isDepartmentExists(deptId);
            if (!deptExists) {
                res.status(400).json({
                    "msg": "Department with given code is not exists."
                });
            } else if (isEmployeeExists) {
                res.status(400).json({
                    "success": false,
                    "error": true,
                    "msg": 'Employee with email is already exists.'
                });
            } else if (!isEmployeeExists) {
                const result = await prisma.employee.create({
                    data: {
                        email: email,
                        name: name,
                        deptId: deptId,
                        age: age
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
            } else {
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

    async function isDepartmentExists(deptId) {
        try {
            const result = await prisma.department.findUnique({
                where: {
                    id: Number(deptId)
                }
            });
            if (result === null) {
                return false;
            }
        } catch (error) {
            console.log("Erorr from isDepartmentExists : ", error)
        }
        return true;
    }

//update a employee details
router.put("/updateEmployee", async (req, res) => {
    const {
        id,
        name,
        email,
        deptId,
        age
    } = req.body;
    console.log(req.body);
    try {
        const exists = await prisma.employee.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (exists === null) {
            res.json({
                success: false,
                error: true,
                msg: `Employee with id ${id} does not exists.`
            })
        }
        if (exists) {
            const data = {
                ...exists,
                name: name,
                email: email,
                deptId: deptId,
                age: age
            };

            const isDeptExists = await isDepartmentExists(deptId);
            if (!isDeptExists) {
                res.json({
                    ...commonResponse,
                    success: false,
                    error: true,
                    msg: 'Department id does not exists.',
                    statusCode: 400
                })
            } else {
                const result = await prisma.employee.update(
                    {
                        where: {
                            id: Number(id)
                        },
                        data: data
                    }
                );
                console.log(result);
                res.send(result);
            }
        }
    } catch (error) {
        console.log(error);
        res.json({
            ...commonResponse,
            success: false,
            error: true,
            msg: "Sever Error!!!"
        })
    }
});


//delete employee by id
router.delete("/deleteEmployee/:id", async (req, res) => {
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
    }else{
    const result = await prisma.employee.delete({
        where: {
            id: Number(id)
        }
    });
    res.status(200).json({
        success: true,
        error: false
    });
    }
});

//get employee by id using params
router.get("/employee/:id", async (req, res) => {
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
router.get("/getEmployeeByName", async (req, res) => {
    const { name } = req.query;
    try {
        const result = await prisma.$queryRaw`SELECT name,email FROM "employee" WHERE name = ${name}`;
        res.send(result);
    } catch (error) {
        console.log(error);
    }
    // const result = await prisma.employee.findFirst({
    //     where:{
    //         name: String(name)
    //     }
    // });
});

// get employee by id  using query
router.get("/getEmployeeById", async (req, res) => {
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
router.get("/getEmployees", async (req, res) => {
    const result = await prisma.$queryRaw`SELECT * FROM "employee"`;
    res.send(result);
}
);

/* 
serach with a give specific value
*/
router.get("/search", async (req, res) => {
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

module.exports = router;