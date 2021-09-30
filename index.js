const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3300
const HOST = process.env.HOST

const { PrismaClient } =  require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());

app.get("/",async (req,res)=>{
    try{
    const result = await prisma.employee.findMany();
    res.json(result);
    }catch(err){
        res.json({
            "Success": false,
            "Error": true,
            "Error Message": `${err}`
        })
    }
});
app.post("/addEmployee",async(req, res)=>{
    const { employee } = req.body;

});

app.get("/user",(req,res)=>{
    res.json({
        "success": true,
        "error": false
    })
});

app.listen(PORT,(err)=>{
    if(err){
        console.log(`Server Error : ${err}`);
    }
    console.log(`Server is running on port ${PORT}`);
});