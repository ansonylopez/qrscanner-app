import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  swiperOpts = {
    allowSlidePrev: false,
    allowSlideNext: false,
  }

  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocalService: DataLocalService
    ) {}

  ionViewDidEnter() {
    this.scan()

  }

  ionViewWillEnter() {


  }

  scan() {

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if (!barcodeData.cancelled) {
        this.dataLocalService.saveArchive(barcodeData.format, barcodeData.text);
      }

    }).catch(err => {

      // this.dataLocalService.saveArchive('QRCode', 'https://www.google.com')
      this.dataLocalService.saveArchive('QRCode', 'geo:40.68467240898113,-73.95100965937503')

    })

  }

}
