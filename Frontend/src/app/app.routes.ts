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
        { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { roles: ["1", "0"] } },
        { path: 'sales', component: Sales },
        { path: 'products', component: Products },
        { path: 'orders', component: Orders },
        { path: 'accounting', component: Accounting },
        { path: 'expenses', component: Bills },
        { path: 'cash-register', component: Box},
        { path: 'settings', component: Categories },
        { path: 'users', component: Users }
    ]}
];
