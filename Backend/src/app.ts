import express from 'express';
import cors from 'cors';
import router_products  from './routes/products.route';
import router_users from './routes/user.route';
import router_auth from './routes/auth.route';
import router_orders from './routes/orders.route';
import router_sales from './routes/sales.route';
import router_box from './routes/box.route';
import errorHandler from './middlewares/error.middleware'
import router_bills from './routes/bills.route';
import router_categories from './routes/categories.route';
import router_paymentMethods from './routes/paymentMethods.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/products', router_products);
app.use('/api/v1/users', router_users);
app.use('/api/v1/auth', router_auth);
app.use('/api/v1/orders', router_orders);
app.use('/api/v1/sales', router_sales);
app.use('/api/v1/box', router_box);
app.use('/api/v1/bills', router_bills);
app.use('/api/v1/categories', router_categories);
app.use('/api/v1/paymentMethods', router_paymentMethods);

app.use(errorHandler);

export default app;