import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { RosterService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
    rosterData = null;

    constructor(private rosterService: RosterService) {}

    ngOnInit() {
            this.rosterService.getAll()
                    .pipe(first())
                    .subscribe(rosterData => this.rosterData = rosterData);
    }


    deletePeriod(id: string) {
        //alert(this.periodData.find(x => x.id === id));
        const roster = this.rosterData.find(x => x.rosterid === id);
        roster.isDeleting = true;
     //   alert(period.isDeleting);
        this.rosterService.delete(id)
            .pipe(first())
            .subscribe(() => this.rosterData = this.rosterData.filter(x => x.rosterid !== id));
    }
}