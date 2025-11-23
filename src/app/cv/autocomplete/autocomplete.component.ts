import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { 
  debounceTime, 
  distinctUntilChanged, 
  switchMap, 
  filter,
  catchError,
  of
} from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  router = inject(Router);
  
  results: Cv[] = [];
  showResults = false;

  get search(): AbstractControl {
    return this.form.get("search")!;
  }
  
  form = this.formBuilder.group({ search: [""] });

  ngOnInit() {
    this.search.valueChanges
      .pipe(
        filter((value: string) => {
          const trimmed = value?.trim() || '';
          if (trimmed.length === 0) {
            this.results = [];
            this.showResults = false;
            return false;
          }
          return trimmed.length >= 2;
        }),
        debounceTime(300),
        switchMap((name: string) => {
          this.showResults = true;
          return this.cvService.selectByName(name).pipe(
            catchError((error) => {
              console.error('Erreur lors de la recherche:', error);
              return of([]);
            })
          );
        })
      )
      .subscribe({
        next: (cvs: Cv[]) => {
          this.results = cvs;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.results = [];
        },
      });
  }

  selectCv(cv: Cv) {
    this.results = [];
    this.showResults = false;
    this.search.setValue("");
    
    this.router.navigate(['/cv', cv.id]).then(() => {
    });
  }
}
