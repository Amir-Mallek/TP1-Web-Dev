import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable } from 'rxjs';
import { UserDto } from '../dto/user.dto';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  isAuthenticated = computed(() => this.token() !== null);

  token = signal<string | null>(localStorage.getItem('token'));
  currentUser = computed<UserDto | null>(() => {
    console.log('AuthService: fetching current user');
    if (!this.isAuthenticated()) {
      return null;
    }
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString) as UserDto;
    }
    return null;
  });

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials);
  }

  logout() {
    this.token.set(null);
    localStorage.removeItem('token');
  }
}
