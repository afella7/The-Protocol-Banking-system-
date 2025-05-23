import express from 'express';
import accountRoutes from './routes/account.route';
import cardRoutes from './routes/card.route';

const app = express();

app.use(express.json());

app.use('/api', accountRoutes);
app.use('/api', cardRoutes);

app.get('/', (req, res) => {
  res.send('The Protocol API is running!');
});

// Optional: basic error handler
import { Request, Response, NextFunction } from 'express';

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;

