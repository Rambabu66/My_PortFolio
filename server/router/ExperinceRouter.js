const express=require("express")
const { createExperience, getExperince, updateExperince, deleteExperince } = require("../controller/ExperinceController")
const router=express.Router()

router.post("/addExperince",createExperience)
router.get("/getExperince",getExperince)
router.put("/updateExperince/:experinceId",updateExperince)
router.delete("/deleteExperince/:experinceId",deleteExperince)



module.exports=router