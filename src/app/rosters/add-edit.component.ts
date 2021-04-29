import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { PeriodService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    periodid: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private periodService: PeriodService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.periodid = this.route.snapshot.params['id'];
        //this.isAddMode = !this.studentid;
        this.isAddMode = !this.periodid;

        

        //alert(!this.classid);
        
        // password not required in edit mode
        const periodValidators = [Validators.minLength(20)];
        if (this.isAddMode) {
            periodValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            periodid:['', ''],
            periodname:['', periodValidators],
            period_desc:['', ''],
            period_date:['', ''],
            period_start:['', ''],
            period_end:['', ''],
            created_by:['', ''],
            updated_by:['', '']
        });

        if (!this.isAddMode) {
            this.periodService.getById(this.periodid)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

   // $("#period_date").datetimepicker({format: 'yyyy-MM-dd'});


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
            this.createPeriod();
        } else {
            this.updatePeriod();
        }
    }

    private createPeriod() {
        this.periodService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Period added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updatePeriod() {
        this.periodService.update(this.periodid, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    //alert(this.periodid);
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