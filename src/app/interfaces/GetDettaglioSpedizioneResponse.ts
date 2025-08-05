import { GetDettaglioSpedizione } from "./GetDettaglioSpedizione";

export interface GetDettaglioSpedizioneResponse {
  data: GetDettaglioSpedizione;
  totalCount: number;
  page: number;
  pageSize: number;
}