import { Component, OnInit } from '@angular/core';
import { CvService } from '../cv/services/cv.service';
import { Cv } from '../cv/model/cv';

@Component({
  selector: 'app-master-details-cv',
  templateUrl: './master-details-cv.component.html',
  styleUrls: ['./master-details-cv.component.css']
})
export class MasterDetailsCvComponent implements OnInit {
  cvs: Cv[] = [];
  selectedCv: Cv | null = null;

  constructor(private cvService: CvService) {}

  ngOnInit(): void {
    this.cvService.getCvs().subscribe({
      next: (data) => this.cvs = data,
      error: (err) => console.error(err)
    });
  }

  selectCv(cv: Cv) {
    this.selectedCv = cv;
  }
}
