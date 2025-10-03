import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import {SidebarService} from '../../../core/services/sidebar/sidebar';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit, OnDestroy {
  isOpen = false;
  private sub!: Subscription;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sub = this.sidebarService.sidebarOpen$.subscribe((state) => {
      this.isOpen = state;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
