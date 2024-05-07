const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const router = require("./router/index");
const userRouter = require("./router/user")
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const adminRouter = require("./router/admin"); 

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'))
mongoose.connect(`mongodb+srv://news:fhgetdN124cA6rMx@cluster0.eqs2r6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
app.use("/", router);
app.use("/user", userRouter);
app.use("/admin", adminRouter)
 
app.listen(port, () => console.log(`listening  http://localhost:${port}`));
//
//