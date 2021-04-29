import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ClassService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    classid: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private classesService: ClassService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.classid = this.route.snapshot.params['id'];
        //this.isAddMode = !this.studentid;
        this.isAddMode = !this.classid;

        //alert(!this.classid);
        
        // password not required in edit mode
        const classValidators = [Validators.minLength(20)];
        if (this.isAddMode) {
            classValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            classid:['', ''],
            classname:['', classValidators],
            class_desc:['', ''],
            userid:['', ''],
            gradeid:['', ''],
            roomid:['', ''],
            created_by:['', ''],
            updated_by:['', '']
        });

        if (!this.isAddMode) {
            this.classesService.getById(this.classid)
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
            this.createClass();
        } else {
            this.updateClass();
        }
    }

    private createClass() {
        this.classesService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Class added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateClass() {
        this.classesService.update(this.classid, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    alert(this.classid);
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