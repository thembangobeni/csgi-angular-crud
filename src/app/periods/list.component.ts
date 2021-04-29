import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { PeriodService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
    periodData = null;

    constructor(private periodService: PeriodService) {}

    ngOnInit() {
            this.periodService.getAll()
                    .pipe(first())
                    .subscribe(periodData => this.periodData = periodData);
    }


    deletePeriod(id: string) {
        //alert(this.periodData.find(x => x.id === id));
        const period = this.periodData.find(x => x.periodid === id);
        period.isDeleting = true;
     //   alert(period.isDeleting);
        this.periodService.delete(id)
            .pipe(first())
            .subscribe(() => this.periodData = this.periodData.filter(x => x.periodid !== id));
    }
}