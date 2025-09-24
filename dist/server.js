"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 3000;
app_1.server.server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
