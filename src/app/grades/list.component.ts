import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { GradeService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
     gradesData = null;

    constructor(private gradesService: GradeService) {}

    ngOnInit() {
            this.gradesService.getAll()
                    .pipe(first())
                    .subscribe(gradesData => this.gradesData = gradesData);
    }


    deleteGrade(id: string) {
        //alert(this.gradesData.find(x => x.id === id));
        const grades = this.gradesData.find(x => x.gradeid === id);
        grades.isDeleting = true;
        alert(grades.isDeleting);
        this.gradesService.delete(id)
            .pipe(first())
            .subscribe(() => this.gradesData = this.gradesData.filter(x => x.gradeid !== id));
    }
}