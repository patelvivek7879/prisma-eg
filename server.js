const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3300
const HOST = process.env.HOST

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use("/api/employee", require("./services/Employee"));
app.use("/api/department", require("./services/Department"));

/* handle request on port 3300
 */
app.listen(PORT, (err) => {
    if (err) {
        console.log(`Server Error : ${err}`);
    }
    console.log(`Server is running on port ${PORT}`);
});