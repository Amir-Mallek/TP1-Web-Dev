import { AbstractControl, ValidationErrors } from "@angular/forms";

export function cinAgeValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const cin = control.value;
    if (!cin || cin.length < 2) return null; 

    const firstChars = parseInt(cin.substring(0, 2), 10); 
    const ageControl = control.root.get('age');
    if (!ageControl) return null;

    const age = ageControl.value;
    if (age >= 60) {
      if (firstChars < 0 || firstChars > 19) {
        return { cinAgeCorrelation: true };
      }
    } else {
      if (firstChars <= 19) {
        return { cinAgeCorrelation: true };
      }
    }

    return null; 
  };
}
