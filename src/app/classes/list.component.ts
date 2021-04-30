import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { ClassService, GradeService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
     classesData = null;
     gradeData = null;

    constructor(private classesService: ClassService, private gradeService: GradeService) {}

    ngOnInit() {
            this.classesService.getAll()
                    .pipe(first())
                    .subscribe(classesData => this.classesData = classesData);

            this.gradeService.getAll()
                    .pipe(first())
                    .subscribe(gradeData => this.gradeData = gradeData);

             
    }


    getParentNameById(id: any) {
        const parent =  this.gradeData.find(parent => parent.gradeid === id);
        if (!parent) {
          // we not found the parent
          alert('im here not parent');
          return ''
        }
    
        alert('im here parent name'+parent.gradecode);
        return parent.gradecode
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