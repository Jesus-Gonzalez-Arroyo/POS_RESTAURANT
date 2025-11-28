import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Alert } from '../../../shared/utils/alert';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private location: Location) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token');
    if (!token) {
      Alert('Acceso denegado', 'Debes iniciar sesión para acceder a esta página.', 'warning');
      return this.router.parseUrl('/');
    }

    const allowedRoles = route.data['roles'] as number[] | undefined;
    const user = this.decodeToken(token);
    const userRole = user?.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      Alert('Acceso denegado', 'No tienes permisos para acceder a esta página.', 'error');
      setTimeout(() => {
        this.location.back();
      }, 1000);
      return false;
    }

    return true;
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Token inválido');
      return null;
    }
  }
}
