import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../../models/index';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<any> {
    const formData = this.createFormData(product);
    return this.http.post<any>(this.baseUrl, formData);
  }

  updateProduct(id: number, product: Omit<Product, 'id'>): Observable<any> {
    const formData = this.createFormData(product);
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }
  
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  private createFormData(product: Omit<Product, 'id'>): FormData {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('earnings', product.earnings.toString());
    formData.append('category', product.category);
    formData.append('availability', product.availability.toString());
    
    if (product.img) {
      formData.append('img', product.img);
    } else {
      console.log('No hay imagen para agregar');
    }
    
    return formData;
  }
}