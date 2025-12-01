import { Routes } from '@angular/router';

import { Login } from './pages/login/login'
import { Dashboard } from './pages/dashboard/dashboard'
import { Sales } from './pages/sales/sales'
import { AuthGuard } from './core/guards/auth/auth-roles-guard';
import { Layout } from './shared/components/layout/layout';
import { Products } from './pages/products/products';
import { Orders } from './pages/orders/orders';
import { Accounting } from './pages/accounting/accounting';
import { Bills } from './pages/bills/bills';
import { Box } from './pages/box/box';
import { Categories } from './pages/settings/settings';
import { Users } from './pages/users/users';

export const routes: Routes = [
    { path: '', component: Login},
    { path: '', component: Layout, children: [
        { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { roles: ["0"] } },
        { path: 'sales', component: Sales, canActivate: [AuthGuard], data: { roles: ["1", "0"] } },
        { path: 'products', component: Products, canActivate: [AuthGuard], data: { roles: ["0"] } },
        { path: 'orders', component: Orders, canActivate: [AuthGuard], data: { roles: ["1", "0"] } },
        { path: 'accounting', component: Accounting, canActivate: [AuthGuard], data: { roles: ["0"] } },
        { path: 'expenses', component: Bills, canActivate: [AuthGuard], data: { roles: ["0"] } },
        { path: 'cash-register', component: Box, canActivate: [AuthGuard], data: { roles: ["1", "0"] } },
        { path: 'settings', component: Categories, canActivate: [AuthGuard], data: { roles: ["0"] } },
        { path: 'users', component: Users, canActivate: [AuthGuard], data: { roles: ["0"] } }
    ]}
];
