import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css'
})
export class UserInputComponent {
  userFullName: string = '';
  @Output() add = new EventEmitter<string>();

  addUser() {
    this.add.emit(this.userFullName);
    this.userFullName = '';
  }
}
