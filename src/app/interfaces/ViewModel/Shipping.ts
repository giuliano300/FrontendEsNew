import { Names } from "../Names";
import { UserLogos } from "../UserLogos";
import { UserSenders } from "../UserSenders";

export class Shipping{
    productType?: number;
    sendType?: number;
    bulletin?: number;
    logosId?: number;
    sender?: UserSenders;
    logo?: UserLogos;
    format?: number;
    printType?: number;
    frontBack?: number;
    returnReceipt?: number;
    names?: Names[];
}