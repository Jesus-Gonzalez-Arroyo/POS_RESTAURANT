import { Routes } from '@angular/router';

import { Login } from './pages/login/login'
import { Dashboard } from './pages/dashboard/dashboard'
import { Sales } from './pages/sales/sales'
import { AuthGuard } from './core/guards/auth/auth-roles-guard';
import { Layout } from './shared/components/layout/layout';

export const routes: Routes = [
    { path: '', component: Login},
    { path: '', component: Layout, children: [
        { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard], data: { roles: ["1"] } },
        { path: 'sales', component: Sales }
    ]}
];
