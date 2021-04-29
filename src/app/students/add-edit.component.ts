import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { StudentService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    studentid: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private studentService: StudentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.studentid = this.route.snapshot.params['id'];
        //this.isAddMode = !this.studentid;
        this.isAddMode = !this.studentid;

        alert(!this.studentid);
        
        // password not required in edit mode
        const genderValidators = [Validators.minLength(1)];
        if (this.isAddMode) {
            genderValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            studentid:['', ''],
            student_name:['', Validators.required],
            last_name:['', Validators.required],
            date_of_birth:['', Validators.required],
            gender:['', genderValidators],
            created_by:['', ''],
            updated_by:['', '']
        });

        if (!this.isAddMode) {
            this.studentService.getById(this.studentid)
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
        this.studentService.update(this.studentid, this.form.value)
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