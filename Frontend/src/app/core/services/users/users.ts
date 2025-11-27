import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { User, createUser } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class Users {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/users`

  getUsers() {
    return this.http.get<User[]>(this.apiUrl)
  }

  createUser(userData: createUser) {
    return this.http.post(`${this.apiUrl}/create`, userData)
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/delete/${userId}`)
  }

  updateUser(userId: string, userData: createUser) {
    return this.http.put(`${this.apiUrl}/update/${userId}`, userData)
  }
}
