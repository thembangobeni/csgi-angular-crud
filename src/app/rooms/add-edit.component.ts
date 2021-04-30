import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { GradeService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    gradeid: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private gradesService: GradeService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.gradeid = this.route.snapshot.params['id'];
        //this.isAddMode = !this.studentid;
        this.isAddMode = !this.gradeid;

        //alert(!this.gradeid);
        
        // password not required in edit mode
        const gradeValidators = [Validators.minLength(2)];
        if (this.isAddMode) {
            gradeValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            gradeid:['', ''],
            gradecode:['', gradeValidators],
            grade:['', Validators.required],
            created_by:['', ''],
            updated_by:['', '']
        });

        if (!this.isAddMode) {
            this.gradesService.getById(this.gradeid)
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
            this.createGrade();
        } else {
            this.updateGrade();
        }
    }

    private createGrade() {
        this.gradesService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Grade added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateGrade() {
        this.gradesService.update(this.gradeid, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    alert(this.gradeid);
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