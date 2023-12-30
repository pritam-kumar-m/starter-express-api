import express from 'express';
import cors from "cors";
const app = express();
app.use(
    cors({
      credentials: true,
    })
  );
app.get('/', (req, res) => { 
    res.send('listening');
})

app.listen(8000, () => {
    console.log('listening on port 3000');
})