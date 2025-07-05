const express=require('express');
const { createSkill, getAllSkills, deleteSkill, updateSkill  } = require('../controller/skillsController');


const router=express.Router();

router.post('/createSkills',createSkill)
router.get("/getAllSkills",getAllSkills)
router.delete("/deleteSkill/:skillId",deleteSkill)
router.put("/updateSkill/:skillId",updateSkill)

module.exports=router;