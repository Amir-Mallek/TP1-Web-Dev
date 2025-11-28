import { Component, inject, effect } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';

import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    imports: [DefaultImagePipe]
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  id = this.activatedRoute.snapshot.params['id'];
  // why this is better than subscribe + BehaviorSubject?
  // 1. automatic unsubscription
  // is it better than observable in change detection in this case?
  // not really, but still better than subscribe + BehaviorSubject
  // why not really?
  // because the cv details component is recreated on each navigation
  // so the automatic unsubscription is not that useful here
  // but still, the signal provides a cleaner and more declarative way
  // to handle the async data
  cv = toSignal(
    this.cvService.getCvById(+this.id).pipe(
      catchError(() => {
        this.router.navigate([APP_ROUTES.cv]);
        return [null];
      })
    ),
    { initialValue: null }
  );
  constructor() {
    effect(() => {
      console.log('CV changed:', this.cv());
    });
  }
  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }
}
