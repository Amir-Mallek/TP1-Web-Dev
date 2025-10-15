import { Injectable, signal, computed } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos = signal<Todo[]>([]);

  waiting = computed(() => this.todos().filter(t => t.status === 'waiting'));
  inProgress = computed(() => this.todos().filter(t => t.status === 'in-progress'));
  done = computed(() => this.todos().filter(t => t.status === 'done'));

  private nextId = 1;

  addTodo(name: string, content: string) {
    if (!name.trim() || !content.trim()) return;
    const todo: Todo = {
      id: this.nextId++,
      name,
      content,
      status: 'waiting'
    };
    this.todos.update(arr => [...arr, todo]);
  }

  changeStatus(id: number, newStatus: TodoStatus) {
    this.todos.update(arr =>
      arr.map(t => t.id === id ? { ...t, status: newStatus } : t)
    );
  }
}
