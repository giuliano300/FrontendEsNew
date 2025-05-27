export enum ProductTypes {
    ROL = 1,
    LOL = 2,
    TOL = 3,
    MOL = 4,
    COL = 5, 
    AGOL = 6,
    VOL = 7
  }

export class ProductTypesClass {
  static  productTypes: ProductTypes[] = [
    ProductTypes.ROL,
    ProductTypes.LOL,
    ProductTypes.TOL,
    ProductTypes.MOL,
    ProductTypes.COL,
    ProductTypes.AGOL,
    ProductTypes.VOL
  ];
}

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