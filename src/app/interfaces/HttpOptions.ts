import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  observe?: 'body';
}
