import app from './src/app.js';
import connectDB from './src/db/db.js';
import 'dotenv/config';

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
