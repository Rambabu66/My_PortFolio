const express =require('express')
const { createProjects, getproject, deleteProject, getSingleProject, updateProject } = require('../controller/projectContoller')
const router= express.Router()

router.post("/createProject",createProjects)
router.get("/getAllProject",getproject)
router.delete("/deleteProject/:projectId",deleteProject)
router.get("/getSingleProject/:projectId",getSingleProject)
router.put("/updateProject/:projectId",updateProject)


module.exports=router