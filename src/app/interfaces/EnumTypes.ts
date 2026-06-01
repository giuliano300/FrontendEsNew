export enum ProductTypes {
    ROL = 1,
    LOL = 2,
    TOL = 3,
    MOL = 4,
    COL4 = 5, 
    AGOL = 6,
    VOL = 7,
    COL1 = 8
  }

export class ProductTypesClass {
  static  productTypes: ProductTypes[] = [
    ProductTypes.ROL,
    ProductTypes.LOL,
    ProductTypes.TOL,
    ProductTypes.MOL,
    ProductTypes.COL4,
    ProductTypes.AGOL,
    ProductTypes.VOL,
    ProductTypes.COL1
  ];
}

export const ProductTypeDescriptions: { [key in ProductTypes]: string } = {
  [ProductTypes.ROL]: 'ROL',
  [ProductTypes.LOL]: 'LOL',
  [ProductTypes.TOL]: 'TOL',
  [ProductTypes.MOL]: 'MOL',
  [ProductTypes.COL4]: 'COL4',
  [ProductTypes.AGOL]: 'AGOL',
  [ProductTypes.VOL]: 'VOL',
  [ProductTypes.COL1]: 'COL1'
};

export enum HaveBulletin{
  no = 0,
  si = 1
}

export enum ShippingTypes{
  singola = 1,
  multipla = 2
}

export enum PrintType{
  BiancoNero = 0,
  Colori = 1
}

export enum RR{
  Si = 0,
  No = 1
}

export enum FrontBack{
  SoloFronte = 0,
  FronteRetro = 1
}

export enum Options
{
  hidePrice = 1,
  rr = 2,
  Ged = 3,
  GedPoset = 4
}

export enum UserTypes
{
  Administrator = 1,
  Visualizzatore = 2,
  Inseritore = 3
}

export enum NotificationType
{
  FromPoste = 1,
  FromEs = 2
}

export enum TourPage
{
  dashboard = 1,
  nuovaSpedizione = 2,
  sigleMultiple= 3,
  withWithoutBulletin= 4,
  raccomandataSingola2= 5,
  selectSender= 6,
  selectRecipent= 7,
  uploadFile= 8,
  compilaBollettino= 9,
  calcoloPreventivo= 10,
  raccomandataMultipla2= 11,
  uploadCsvMulti= 12,
  raccomandataMultipla4= 13,
  letteraSingola2= 14,
  letteraMultipla2= 15,
  telegramma1= 16,
  telegramma4= 17,
  agolMultiplo2= 18,
  agolSingolo2= 19,
  visuraSingola1= 20,
  visuraSingola2= 21,
  visuraSingola3= 22,
  statoinvii= 23,
  archivioSpedizioni= 24,
  dettaglioSpedizione= 25,
  archivioVisure= 26,
  reportSpedizioni= 27,
  reportSpedizioniBollettini= 28,
  comprimiPDf= 29,
  stampaUnione= 30,
  unionePDf= 31,
  sincBipiol= 32,
  datiPersonali= 33,
  utentiList= 34,
  userAdd= 35,
  userSender=36,
  addSender= 37,
  rubricaDestinatari= 38,
  addRecipient= 39,
  personalizzazioneCover= 40,
  addLogo= 41,
  erroriNotificati= 42,
  letteraMultipla4 = 43,
}
