import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Archive } from '../../models/archive.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public dataLocalService: DataLocalService) {}

  sendEmail() {
    this.dataLocalService.sendEmail()
  }

  openLog(archive: Archive) {
    this.dataLocalService.openLog(archive)
  }

}
