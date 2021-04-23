

export class Archive {

  public format: string;
  public text: string;
  public type: string;
  public icon: string;
  public created: Date;

  constructor(format: string, text: string) {

    this.format = format;
    this.text = text;

    this.created = new Date();
    this.determineType();

  }

  private determineType() {

    const textStart = this.text.substr(0, 4);

    console.log('Tipo', textStart, this.text);

    switch (textStart) {
      case 'http':
        this.type = 'http';
        this.icon = 'globe';
        break;

      case 'geo:':
        this.type = 'geo'
        this.icon = 'pin'
        break;

      default:
        this.type = 'Not found'
        this.icon = 'create'
        break;
    }


  }

}
