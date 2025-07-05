const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const connectedDB = require('./database/Db')
const authRouter = require('./router/authRouter')
const projectRouter = require('./router/projectRouter')
const skillsRouter = require('./router/skillsRouter')
const educationRouter = require('./router/educationRouter')
const experinceRouter = require('./router/ExperinceRouter')
const path = require('path'); // Import the path module


// Conneted database
connectedDB()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS - place this before your routes.
// The previous 'option' variable was defined but not used.
// Calling cors() with no options allows all origins, which is fine for development.
app.use(cors());

// Router
app.use("/api/auth",authRouter)
app.use("/api/projects",projectRouter)
app.use("/api/skills",skillsRouter)
app.use("/api/education",educationRouter)
app.use("/api/experince",experinceRouter)



// ... start server
const port = process.env.PORT || 5004;
app.listen(port,()=>{
    console.log(`server is running at ${port}`);
    
})
