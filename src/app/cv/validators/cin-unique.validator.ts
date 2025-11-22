import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { map , catchError } from "rxjs/operators";
import { of } from "rxjs";
import { CvService } from "../services/cv.service";

export function cinUniqueValidator(cvService: CvService): AsyncValidatorFn {
    return (control: AbstractControl) => {
        const cin = control.value;
        if (!cin) {
            return of(null);
        }
        return cvService.selectByProperty('cin', cin).pipe(
            map(cvs => {
                return cvs && cvs.length > 0 ? { cinNotUnique: true } : null;
            }),
            catchError(() => of(null))
        );
    };
}