import { FormGroup } from "@angular/forms";

export function confirmpasswordvalidator(controlname:string,matchcontrolname:string){
    return (formGroup:FormGroup)=>{
        const passwordcontrol=formGroup.controls[controlname];
        const confirmpasswordcontrol=formGroup.controls[matchcontrolname];
        if(confirmpasswordcontrol.errors && confirmpasswordcontrol.errors['confirmpasswordvalidator']){
            return;
        }
        if(passwordcontrol.value !==confirmpasswordcontrol.value){
            confirmpasswordcontrol.setErrors({confirmpasswordvalidator:true})
        }
        else{
            confirmpasswordcontrol.setErrors(null);
        }

    }

}