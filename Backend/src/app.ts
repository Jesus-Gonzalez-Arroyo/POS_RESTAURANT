import express from 'express';
import router_products  from './routes/products.route';
import router_users from './routes/user.route';
import router_auth from './routes/auth.route';

const app = express();

app.use(express.json());
app.use('/api/v1/products', router_products);
app.use('/api/v1/users', router_users);
app.use('/api/v1/auth', router_auth);

export default app;