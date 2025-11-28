import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CredentialsDto } from '../dto/credentials.dto';
import { ROUTES, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { FormsModule } from '@angular/forms';
import { UserDto } from '../dto/user.dto';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FormsModule]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  login(credentials: CredentialsDto) {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.id);
        this.authService.token.set(response.id);
        const currentUser: UserDto = {
          id: response.id,
          email: credentials.email,
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        this.toastr.success(`Bienvenu chez vous :)`);
        this.router.navigate([APP_ROUTES.cv]);
        console.log(this.authService.currentUser());
      },
      error: (error) => {
        this.toastr.error('Veuillez vérifier vos credentials');
      },
    });
  }
}
