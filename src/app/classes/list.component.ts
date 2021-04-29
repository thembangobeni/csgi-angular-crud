import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { ClassService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
     classesData = null;

    constructor(private classesService: ClassService) {}

    ngOnInit() {
            this.classesService.getAll()
                    .pipe(first())
                    .subscribe(classesData => this.classesData = classesData);
    }


    deleteClass(id: string) {
        //alert(this.gradesData.find(x => x.id === id));
        const classes = this.classesData.find(x => x.classid === id);
        classes.isDeleting = true;
        alert(classes.isDeleting);
        this.classesService.delete(id)
            .pipe(first())
            .subscribe(() => this.classesData = this.classesData.filter(x => x.classid !== id));
    }
}