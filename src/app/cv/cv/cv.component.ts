import {Component, computed, inject, resource} from '@angular/core';
import { Cv } from '../model/cv';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';
import { ListComponent } from '../list/list.component';
import { CvCardComponent } from '../cv-card/cv-card.component';
import { EmbaucheComponent } from '../embauche/embauche.component';
import { UpperCasePipe, DatePipe } from '@angular/common';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {catchError, firstValueFrom, of} from 'rxjs';
@Component({
    selector: 'app-cv',
    templateUrl: './cv.component.html',
    styleUrls: ['./cv.component.css'],
    imports: [
        ListComponent,
        CvCardComponent,
        EmbaucheComponent,
        UpperCasePipe,
        DatePipe,
    ]
})
export class CvComponent {
  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);
  private cvService = inject(CvService);
  // why this is better than subscribe + BehaviorSubject?
  // 1. automatic unsubscription
  // 2. better integration with Angular's change detection
  // the signal updates only the parts of the template that depend on it
  // while BehaviorSubject triggers a full change detection cycle


  cvs = rxResource({
    stream: () =>
      this.cvService.getCvs().pipe(
        catchError((err) => {
          this.toastr.error(`
        Attention!! Les données sont fictives, problème avec le serveur.
        Veuillez contacter l'admin.`);
          return of(this.cvService.getFakeCvs());
        })
      ),
    defaultValue: []
  });
  selectedCv = computed(() => this.cvService.selectedCv());
  /*   selectedCv: Cv | null = null; */
  date = new Date();

  constructor() {
    this.logger.logger('je suis le cvComponent');
    this.toastr.info('Bienvenu dans notre CvTech');
  }
}
