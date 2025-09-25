import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token');
    if (!token) {
      return this.router.parseUrl('/');
    }

    const allowedRoles = route.data['roles'] as number[] | undefined;
    const user = this.decodeToken(token);
    const userRole = user?.role;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return this.router.parseUrl('/');
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
