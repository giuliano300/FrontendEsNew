import { FncUtils } from "../fncUtils/fncUtils";

export class Recipients {
  id?: number = 0;
  insertDate: string = new Date().toISOString();
  operationId: number = 0;
  logoId?: number  = 0;
  productType: number = 0;
  businessName: string = "";
  complementName?: string | null = null;
  address: string = "";
  complementAddress?: string | null = null;
  zipCode: string = "";
  fiscalCode?: string | null = null;
  city: string = "";
  province: string = "";
  state: string = "";
  currentState: number = 0;
  valid: boolean = true;
  format: number = 0;
  printType: number = 0;
  frontBack: number = 0;
  returnReceipt: boolean = false;
  code?: string = "";
  codiceAgolAr?: string = "";
  numberOfPages?: number = 0;
  price?: number | null = 0;
  vatPrice?: number | null = 0;
  totalPrice?: number | null = 0 ;
  attachedFile?: string | null = null;
  attachedFileRR?: string | null = null;
  attachedFileRA?: string | null = null;
  fileName?: string | null = null;
  pathRecoveryFile?: string | null = null;
  pathGEDUrl?: string | null = null;
  digitalReturnReceipt?: boolean | null = false;
  message?: string | null = null;
  tag1?: string | null = null;
  tag2?: string | null = null;
  tag3?: string | null = null;
  tag4?: string | null = null;
  tag5?: string | null = null;
  tag6?: string | null = null;
  posteType?: string | null = null;
  tipologiaNotificante?: number | null = null;
  valoreNotificante?: string | null = null;
  telegramText?: string | null = null;
  pec?: string | null = null;
  notified?: boolean | null = false;
  fromApi: boolean = false;
  tempGuid: string = FncUtils.generateGuid();

  //CAMPI VISURA
  vat?: string;
  ccia?: string;
  reaNumber?: string;
  typeVisura?: number;
}
