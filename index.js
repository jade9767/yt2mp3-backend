const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Optional route to confirm it's working
app.get('/', (req, res) => {
  res.send('yt2mp3 backend is alive!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
