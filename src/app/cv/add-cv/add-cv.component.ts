import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { debounceTime, Subscription } from "rxjs";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent implements OnInit, OnDestroy {
  private readonly STORAGE_KEY = 'addCvFormData';
  private formSubscription?: Subscription;

  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  form = this.formBuilder.group(
    {
      name: ["", Validators.required],
      firstname: ["", Validators.required],
      path: [""],
      job: ["", Validators.required],
      cin: [
        "",
        {
          validators: [Validators.required, Validators.pattern("[0-9]{8}")],
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
  );

  ngOnInit() {
    this.restoreFormData();
    
    this.updatePathFieldState();
    
    this.age.valueChanges.subscribe(() => {
      this.updatePathFieldState();
    });

    this.formSubscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.saveFormData();
      });
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private saveFormData() {
    const formValue = this.form.getRawValue();
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formValue));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans le localStorage:', error);
    }
  }

  private restoreFormData() {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const formData = JSON.parse(savedData);
        this.form.patchValue(formData, { emitEvent: false });
        this.updatePathFieldState();
        this.toastr.info('Vos données précédentes ont été restaurées', 'Données restaurées');
      }
    } catch (error) {
      console.error('Erreur lors de la restauration depuis le localStorage:', error);
    }
  }


  private updatePathFieldState() {
    const age = Number(this.age.value) || 0;
    const pathControl = this.path;
    if (pathControl) {
      if (age < 18) {
        pathControl.disable();
        pathControl.setValue("");
      } else {
        pathControl.enable();
      }
    }
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
}
