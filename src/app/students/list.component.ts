import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { StudentService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
     studentData = null;
   // todayNumber: number = Date.now();
   // todayDate : Date = new Date();
   // todayString : string = new Date().toDateString();
   // todayISOString : string = new Date().toISOString();

    constructor(private studentService: StudentService) {}

    ngOnInit() {
       // alert('on Init');
       /* this.studentService.getStudents()
            .pipe(first())
            .subscribe(studentData => this.studentData = studentData);*/

          /*  this.studentService.getAll()
                    .pipe(first())
                    .subscribe(studentData => this.studentData = studentData);
         */
            this.studentService.getAll()
                    .pipe(first())
                    .subscribe(studentData => this.studentData = studentData);

         // this.getStudentsList();

    }

    /*getStudentsList() {
        this.studentService.getStudents()
        .pipe(first())
        .subscribe(students => this.students = students);
        
      }*/

    deleteStudent(id: string) {
        const student = this.studentData.find(x => x.studentid === id);
        student.isDeleting = true;
        this.studentService.delete(id)
            .pipe(first())
            .subscribe(() => this.studentData = this.studentData.filter(x => x.student !== id));
    }
}