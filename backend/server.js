const express = require('express');
const cors = require('cors');
const user = require("./routes/user");
const connectDb = require("./config/dbconnection");
const blogRoutes = require('./routes/blogRoutes'); // Import the blog routes
const crud = require('./routes/crud')
const college = require('./routes/college')
const {cloudinaryConnect }= require("../backend/config/cloudinary")
require("dotenv").config();
const eventRoutes = require("./routes/eventRoutes")
const homepageRoutes = require("./routes/homepageRoutes")
const collegeRep=require('./routes/collegeRep')


const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders:["Content-Type"],
    credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.use("/api/auth", user);
app.use("/api/blog", blogRoutes);
app.use("/api/users", crud);
app.use("/api/college",college)
app.use("/api/event",eventRoutes);
app.use("/api/home",homepageRoutes);
app.use("/api/collegeRep",collegeRep)

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
    });
});
cloudinaryConnect();