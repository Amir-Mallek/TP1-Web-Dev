import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";
import { cinUniqueValidator } from "../validators/cin-unique.validator";
import { cinAgeValidator } from "../validators/cin-age-corrlation.validator";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent {
  form;
  constructor(
  private cvService: CvService,
  private router: Router,
  private toastr: ToastrService,
  private formBuilder: FormBuilder
) {
  // Create the form
  this.form = this.formBuilder.group({
    name: ["", Validators.required],
    firstname: ["", Validators.required],
    path: [""],
    job: ["", Validators.required],
    cin: [
      "",
      {
        validators: [
          Validators.required,
          Validators.pattern("[0-9]{8}"),
          cinAgeValidator()
        ],
        asyncValidators: [cinUniqueValidator(this.cvService)],
        updateOn: "change"
      }
    ],
    age: [0, Validators.required]
  });

  // Revalidate CIN when age changes
  this.form.get('age')?.valueChanges.subscribe(() => {
    this.form.get('cin')?.updateValueAndValidity();
  });
}

  
  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
  }

  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname() {
    return this.form.get("firstname");
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job() {
    return this.form.get("job");
  }
  get path() {
    return this.form.get("path");
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }

  get cinErrorMessage(): string | null {
  const cinCtrl = this.cin;
  if (!cinCtrl.touched || !cinCtrl.errors) return null;

  if (cinCtrl.errors['required']) return 'Le CIN est requis.';
  if (cinCtrl.errors['pattern']) return 'Le CIN doit contenir 8 chiffres.';
  if (cinCtrl.errors['cinAgeCorrelation']) return 'La CIN ne correspond pas à l\'âge.';
  if (cinCtrl.errors['cinNotUnique']) return 'Cette CIN existe déjà.';
  
  if (this.form.errors?.['cinFirstCars'] && this.age.touched)
    return 'Cette CIN est invalide.';

  return null;
}

}
