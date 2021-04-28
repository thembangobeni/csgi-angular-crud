import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

//import { AccountService, StudentService, AlertService } from '@app/_services';
import { StudentService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
      //  private accountService: AccountService,
        private studentService: StudentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
       // const passwordValidators = [Validators.minLength(6)];
      //  if (this.isAddMode) {
      //      passwordValidators.push(Validators.required);
      //  }

        this.form = this.formBuilder.group({
            studentid:['', ''],
            student_name:['', Validators.required],
            last_name:['', Validators.required],
            date_of_birth:['', Validators.required],
            gender:['', ''],
            created_by:['', ''],
            updated_by:['', ''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required] 
        });

        if (!this.isAddMode) {
            this.studentService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createStudent();
        } else {
            this.updateStudent();
        }
    }

    private createStudent() {
        this.studentService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Student added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateStudent() {
        this.studentService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}