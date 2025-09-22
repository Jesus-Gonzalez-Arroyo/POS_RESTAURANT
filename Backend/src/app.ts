import express from 'express';
import router_products  from './routes/products.route';

const app = express();

app.use(express.json());
app.use('/api/products', router_products);

export default app;