import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Category } from '../../models/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class Categories {
  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:3000/api/v1/categories';

  getCategories() {
    return this.http.get(this.baseUrl);
  }

  updateCategory(categoryId: number, data: Omit<Category, 'id'>) {
    return this.http.put(`${this.baseUrl}/${categoryId}`, data);
  }

  toggleCategoryState(categoryId: number, isActive: boolean, updatedAt: Date) {
    return this.http.patch(`${this.baseUrl}/${categoryId}`, { isActive, updatedAt });
  }

  createCategory(data: Omit<Category, 'id'>) {
    return this.http.post(this.baseUrl, data);
  }

  deleteCategory(categoryId: number) {
    return this.http.delete(`${this.baseUrl}/${categoryId}`);
  }
}