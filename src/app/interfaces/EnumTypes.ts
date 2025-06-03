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

export const ProductTypeDescriptions: { [key in ProductTypes]: string } = {
  [ProductTypes.ROL]: 'ROL',
  [ProductTypes.LOL]: 'LOL',
  [ProductTypes.TOL]: 'TOL',
  [ProductTypes.MOL]: 'MOL',
  [ProductTypes.COL]: 'COL',
  [ProductTypes.AGOL]: 'AGOL',
  [ProductTypes.VOL]: 'VOL'
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
  
}

export enum UserTypes
{
  Administrator = 1,
  Visualizzatore = 2,
  Inseritore = 3
}
