import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

import { detailreport_vService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
    reportData = null;
    user: User;

    constructor(private reportService: detailreport_vService,private accountService: AccountService) {
      this.user = this.accountService.userValue;
    }


    //.getById(this.periodid)

    ngOnInit() {
      //alert(this.localS);
    // this.user = localStorage.getItem('user');
      
    this.user = JSON.parse(localStorage.getItem('user'));
      alert(this.user.email);

     /* this.reportService.getAll()
      .pipe(first())
      .subscribe(reportData => this.reportData = reportData);*/
      
    this.reportService.getAllDetailReport(this.user.email)
                    .pipe(first())
                    .subscribe(reportData => this.reportData = reportData);
    }


   /* deletePeriod(id: string) {
        //alert(this.periodData.find(x => x.id === id));
        const report = this.reportData.find(x => x.reportid === id);
        report.isDeleting = true;
     //   alert(period.isDeleting);
        this.reportService.delete(id)
            .pipe(first())
            .subscribe(() => this.reportData = this.reportData.filter(x => x.reportid !== id));
    }*/
}