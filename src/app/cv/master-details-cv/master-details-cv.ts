import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ItemComponent } from '../item/item.component';
import {rxResource} from "@angular/core/rxjs-interop";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-master-details-cv',
  standalone: true,
  imports: [CommonModule, RouterModule, ItemComponent],
  templateUrl: './master-details-cv.html',
  styleUrls: ['./master-details-cv.css'],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);

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
    defaultValue: [] as Cv[]
  });

}
