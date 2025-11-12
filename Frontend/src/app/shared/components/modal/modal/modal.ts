import { CommonModule } from '@angular/common';
import { Component,  Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  @Input() show = false;
  @Input() title = 'Modal';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
