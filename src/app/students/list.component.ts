import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { StudentService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    students = null;

    constructor(private studentService: StudentService) {}

    ngOnInit() {
        this.studentService.getAll()
            .pipe(first())
            .subscribe(students => this.students = students);
    }

    deleteUser(id: string) {
        const user = this.students.find(x => x.id === id);
        user.isDeleting = true;
        this.studentService.delete(id)
            .pipe(first())
            .subscribe(() => this.students = this.students.filter(x => x.id !== id));
    }
}