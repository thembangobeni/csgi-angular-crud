import { Component } from '@angular/core';

import { AccountService, StudentService, ClassService, GradeService, RosterService, PeriodService, summaryreport_vService,
        detailreport_vService,teacherService } from './_services';
import { Csgi_class, Csgi_detailreport_v, Csgi_grade, Csgi_period, Csgi_roster, Csgi_student, Csgi_summaryreport_v, Csgi_teacher_v, User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;
    student:Csgi_student;
    classes:Csgi_class;
    grade:Csgi_grade;
    roster:Csgi_roster;
    period:Csgi_period;
    detailreport:Csgi_detailreport_v;
    summaryreport:Csgi_summaryreport_v;
    teacher:Csgi_teacher_v;

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }
/*
    constructor(private studentService: StudentService) {
        this.studentService.student.subscribe(x => this.student = x);
    }

    constructor(private classService: ClassService) {
        this.classService.classes.subscribe(x => this.classes = x);
    }
*/

    logout() {
        this.accountService.logout();
    }
}