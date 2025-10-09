import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  earnings: number;
  category: string;
  availability: boolean;
}

export interface CreateProductDto {
  name: string;
  price: number;
  earnings: number;
  category: string;
  availability: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'http://localhost:3000/api/v1/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  createProduct(product: CreateProductDto): Observable<any> {
    return this.http.post<any>(this.baseUrl, product);
  }

  updateProduct(id: number, product: CreateProductDto): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}