import { Component, signal } from '@angular/core';
import { TodoService } from '../service/todo.service';
import { TodoStatus } from '../model/todo';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css'],
    providers: [TodoService],
    imports: [FormsModule]
})
export class TodoComponent {
  name = signal('');
  content = signal('');

  constructor(public todoService: TodoService) {}

  addTodo() {
    this.todoService.addTodo(this.name(), this.content());
    this.name.set('');
    this.content.set('');
  }

  changeStatus(id: number, status: TodoStatus) {
    this.todoService.changeStatus(id, status);
  }
}
