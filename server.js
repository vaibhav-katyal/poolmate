const express = require('express');
const path = require('path');
const app = express();

// Static files serve
app.use(express.static(path.join(__dirname)));

// Listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
