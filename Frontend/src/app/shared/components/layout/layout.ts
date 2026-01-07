import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {Sidebar} from '../sidebar/sidebar';
import {SidebarService} from '../../../core/services/sidebar/sidebar';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, MatIconModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone: true
})
export class Layout {
  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {}

  openSidebar() {
    this.sidebarService.open();
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
