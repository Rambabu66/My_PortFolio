const express=require('express');
const { createEducationApi, getEducationApi, deleteEducationApi, updateEducationApi } = require('../controller/EducationController');
const router=express.Router();


router.post("/createEducation",createEducationApi)
router.get("/getEducation",getEducationApi)
router.delete("/deleteEducation/:educationId",deleteEducationApi)
router.put("/updateEducation/:educationId",updateEducationApi)

module.exports=router;

//