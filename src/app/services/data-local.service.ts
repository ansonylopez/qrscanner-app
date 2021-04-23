import { Injectable } from '@angular/core';
import { Archive } from '../models/archive.model';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  archives: Archive[] = [];

  constructor(
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
  ) {
    this.loadArchives()
  }

  async loadArchives() {
    this.archives = JSON.parse((await (await Storage.get({ key: 'archives' })).value)) || []
  }


  async saveArchive(format: string, text: string) {
    await this.loadArchives();

    const newArchive = new Archive(format, text);
    this.archives.unshift(newArchive);

    Storage.set({ key: 'archives', value: JSON.stringify(this.archives) });

    this.openLog(newArchive)

  }

  openLog(archive: Archive) {

    this.navCtrl.navigateForward('/tabs/tab2')

    switch (archive.type) {
      case 'http':
        this.iab.create(archive.text, '_system')
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/map/${archive.text}`)
        break;
      default:
        break;
    }
  }

  sendEmail() {

    const arrTemp = [];
    const titles = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titles);

    this.archives.forEach( archive => {

      const row = `${ archive.type }, ${archive.format }, ${archive.created }, ${ archive.text.replace(',', ' ') }\n`

      arrTemp.push(row);
    });

    this.makeFile(arrTemp.join(''));
  }

  makeFile(text: string) {

    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
        .then( exist => {
          console.log('Existe', exist);
          return this.writeInFile( text );
        })
        .catch( err => {
          return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
                      .then( created => this.writeInFile(text))
                      .catch( err => console.log('No se pudo crear el archivo'));
        })

  }

  async writeInFile(text: string) {

    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);
    // console.log('archivo creado');

    const file = `${this.file.dataDirectory}registros.csv`;

    const email = {
      to: 'gogeta_vegito19@hotmail.com',
      // cc: 'algo2@email.com',
      // bcc: ['algo3@email.com'],
      attachments: [
        file
      ],
      subject: 'Backup de scans',
      body: 'Aqui van todos los escaneos realizados con <strong> ScanApp </strong>',
      isHtml: true
    }
    this.emailComposer.open(email)
  }
}
