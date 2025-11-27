import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { Users as UsersService } from '../../core/services/users/users';
import { User, createUser } from '../../core/models';
import { Alert, ConfirmAlert } from '../../shared/utils/alert';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
  standalone: true
})
export class Users implements OnInit {
  protected Math = Math;
  
  users: User[] = [];
  filteredUsers: User[] = [];
  showModal = false;
  isEditMode = false;
  selectedUser: User | null = null;
  loading = true;

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Filtros
  searchTerm: string = '';
  filterRole: string = 'todos';

  // Ordenamiento
  sortBy: string = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';

  userForm: createUser = {
    name: '',
    user: '',
    password: '',
    rol: 1
  };

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.totalItems = users.length;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        Alert('Error', 'No se pudieron cargar los usuarios.', 'error');
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedUser = null;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(user: User): void {
    this.isEditMode = true;
    this.selectedUser = user;
    this.userForm = {
      name: user.name,
      user: user.usuario,
      password: '',
      rol: parseInt(user.rol)
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.userForm = {
      name: '',
      user: '',
      password: '',
      rol: 1
    };
  }

  saveUser(): void {
    if (this.isEditMode && this.selectedUser) {
      this.usersService.updateUser(this.selectedUser.id.toString(), this.userForm).subscribe({
        next: (response: any) => {
          Alert('Usuario actualizado', 'El usuario ha sido actualizado exitosamente.', 'success');
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          Alert('Error', 'No se pudo actualizar el usuario.', 'error');
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.usersService.createUser(this.userForm).subscribe({
        next: (response) => {
          Alert('Usuario creado', 'El usuario ha sido creado exitosamente.', 'success');
          this.loadUsers();
          this.closeModal();
        },
        error: (error) => {
          Alert('Error', 'No se pudo crear el usuario.', 'error');
          console.error('Error creating user:', error);
        }
      });
    }
  }

  deleteUser(userId: number) {
    ConfirmAlert({
      title: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      icon: 'warning',
      btnAccept: 'Sí, eliminar',
      btnCancel: 'Cancelar'
    }).then((confirmed) => {
      if (confirmed) {
        this.usersService.deleteUser(userId.toString()).subscribe({
          next: () => {
            Alert('Usuario eliminado', 'El usuario ha sido eliminado exitosamente.', 'success');
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          }
        });
      }
    });
  }

  getRoleName(rol: string): string {
    return rol === '0' ? 'Administrador' : 'Empleado';
  }

  getRoleBadgeClass(rol: string): string {
    return rol === '0' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  }

  // Aplicar filtros y ordenamiento
  applyFilters() {
    let result = [...this.users];

    // Filtro por término de búsqueda
    if (this.searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.usuario.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtro por rol
    if (this.filterRole !== 'todos') {
      result = result.filter(user => user.rol === this.filterRole);
    }

    // Ordenamiento
    result.sort((a, b) => {
      let comparison = 0;
      
      switch(this.sortBy) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'usuario':
          comparison = a.usuario.localeCompare(b.usuario);
          break;
        case 'rol':
          comparison = a.rol.localeCompare(b.rol);
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredUsers = result;
    this.totalItems = result.length;
    this.currentPage = 1;
  }

  // Limpiar filtros
  clearFilters() {
    this.searchTerm = '';
    this.filterRole = 'todos';
    this.applyFilters();
  }

  // Cambiar ordenamiento
  changeSortBy(field: string) {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  // Obtener usuarios paginados
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  // Obtener número total de páginas
  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Obtener array de páginas para la paginación
  get pages() {
    const maxPages = 5;
    const total = this.totalPages;
    
    if (total <= maxPages) {
      return Array(total).fill(0).map((_, i) => i + 1);
    }

    const current = this.currentPage;
    const pages = [];
    
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push(total);
    } else if (current >= total - 2) {
      pages.push(1);
      for (let i = total - 3; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push(total);
    }
    
    return pages;
  }

  // Navegación de páginas
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Cambiar cantidad de elementos por página
  changeItemsPerPage() {
    this.currentPage = 1;
  }
}
