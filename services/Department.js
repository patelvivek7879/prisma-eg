const router = require("express").Router();
const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();

//add a department
router.post("/addDepartment", async (req, res) => {
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
router.get('/departments', async (req, res) => {
    const result = await prisma.department.findMany();
    res.send(result);
})

module.exports = router;