import { Component, OnInit } from '@angular/core';
import { first, last } from 'rxjs/operators';

import { RoomService } from '@app/_services';

@Component({ templateUrl: 'list.component.html', selector: 'app-datepipe' })
export class ListComponent implements OnInit {
     roomsData = null;

    constructor(private roomsService: RoomService) {}

    ngOnInit() {
            this.roomsService.getAll()
                    .pipe(first())
                    .subscribe(roomsData => this.roomsData = roomsData);
    }


    deleteRoom(id: string) {
        //alert(this.gradesData.find(x => x.id === id));
        const rooms = this.roomsData.find(x => x.roomid === id);
        rooms.isDeleting = true;
        alert(rooms.isDeleting);
        this.roomsService.delete(id)
            .pipe(first())
            .subscribe(() => this.roomsData = this.roomsData.filter(x => x.roomid !== id));
    }
}