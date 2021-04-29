import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const studentModule = () => import('./students/students.module').then(x => x.StudentModule);
const gradeModule = () => import('./grades/grades.module').then(x => x.GradeModule);
const periodModule = () => import('./periods/periods.module').then(x => x.PeriodModule);
const classModule = () => import('./classes/classes.module').then(x => x.ClassModule);
const rosterModule = () => import('./rosters/rosters.module').then(x => x.RosterModule);
//const teacherModule = () => import('./teachers/teachers.module').then(x => x.TeacherModule);
const reportModule = () => import('./reports/reports.module').then(x => x.ReportModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'students', loadChildren: studentModule, canActivate: [AuthGuard] },
    { path: 'grades', loadChildren: gradeModule, canActivate: [AuthGuard] },
    { path: 'rosters', loadChildren: rosterModule, canActivate: [AuthGuard] },
    { path: 'reports', loadChildren: reportModule, canActivate: [AuthGuard] },
    { path: 'periods', loadChildren: periodModule, canActivate: [AuthGuard] },
    { path: 'classes', loadChildren: classModule, canActivate: [AuthGuard] },
   // { path: 'teacher', loadChildren: teacherModule, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }