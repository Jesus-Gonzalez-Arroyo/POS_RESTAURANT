import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from '../../shared/components/modal/modal/modal';

@Component({
  selector: 'app-products',
  imports: [CommonModule, Modal],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  showModal = false;
  modalTitle = 'Agregar Producto';
  products = [
    { id: 1, name: 'Product 1', price: 100, profit: 50, category: 'Category 1', availability: 'In Stock' },
    { id: 2, name: 'Product 2', price: 200, profit: 80, category: 'Category 2', availability: 'Out of Stock' },
    { id: 3, name: 'Product 3', price: 300, profit: 120, category: 'Category 1', availability: 'In Stock' },
    { id: 4, name: 'Product 4', price: 400, profit: 150, category: 'Category 3', availability: 'In Stock' },
    { id: 5, name: 'Product 5', price: 500, profit: 200, category: 'Category 2', availability: 'Out of Stock' }
  ];

  deleteProduct(id: number) {
    this.products = this.products.filter(product => product.id !== id);
  }

  editProduct(product: { id: number; name: string; price: number }) {
    const existingProduct = this.products.find(p => p.id === product.id);
  }

  showAddProductModal() {
    this.showModal = true;
  }
}
