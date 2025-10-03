import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarOpen = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.sidebarOpen.asObservable();

  open() {
    this.sidebarOpen.next(true);
  }

  close() {
    this.sidebarOpen.next(false);
  }

  toggle() {
    this.sidebarOpen.next(!this.sidebarOpen.getValue());
  }
}
