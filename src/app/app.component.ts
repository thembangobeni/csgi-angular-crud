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

    constructor(private accountService: AccountService, private studentService: StudentService, 
                private gradeService: GradeService, private classService: ClassService,
                private rosterService: RosterService, private periodService: PeriodService,
                private detailreportService: detailreport_vService
                ) {
        this.accountService.user.subscribe(x => this.user = x);
        this.studentService.student.subscribe(x => this.student = x);
        this.gradeService.grade.subscribe(x => this.grade = x);
        this.classService.classes.subscribe(x => this.classes = x);
        this.rosterService.roster.subscribe(x => this.roster = x);
        this.detailreportService.detailreport_v.subscribe(x => this.detailreport = x);
        this.periodService.period.subscribe(x => this.period = x);
    }

    logout() {
        this.accountService.logout();
    }
}