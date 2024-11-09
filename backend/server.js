const express = require('express');
const cors = require('cors');
const user = require("./routes/user");
const connectDb = require("./config/dbconnection");
const blogRoutes = require('./routes/blogRoutes'); // Import the blog routes
const crud = require('./routes/crud')
require("dotenv").config();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", user);
app.use("/api/blog", blogRoutes); // Adding blog routes to the server
app.use("/api/users", crud);
 
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
    });
});
cloudinaryConnect();