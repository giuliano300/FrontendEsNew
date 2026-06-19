import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShepherdService } from 'angular-shepherd';
import { of } from 'rxjs';
import { FormStorageService } from './app/services/form-storage.service';
import { CryptoJS } from '@app/utils/crypto';
import { secretKey } from '@app/config/app-constants';

const testUser = {
  id: 1,
  parentId: 1,
  guid: 'test-guid',
  businessName: 'Test User',
  vatNumber: '00000000000',
  email: 'test@example.com',
  password: '',
  address: 'Via Test 1',
  city: 'Roma',
  zipCode: '00100',
  pec: 'test@example.com',
  usernamePoste: '',
  passwordPoste: '',
  enabled: true,
  deleted: false
};

const encryptedStep2 = CryptoJS.AES.encrypt(
  JSON.stringify({
    tipoinvio: '1',
    prodotto: '1',
    bollettino: '2'
  }),
  secretKey
).toString();

const activatedRouteStub = {
  snapshot: {
    paramMap: convertToParamMap({ id: '1' }),
    queryParamMap: convertToParamMap({})
  },
  params: of({ id: '1' }),
  queryParams: of({}),
  paramMap: of(convertToParamMap({ id: '1' })),
  queryParamMap: of(convertToParamMap({}))
};

const modalRefStub = {
  close: () => undefined,
  dismiss: () => undefined
};

const modalServiceStub = {
  open: () => modalRefStub
};

const shepherdServiceStub = {
  modal: false,
  defaultStepOptions: {},
  tourObject: {
    on: () => undefined
  },
  addSteps: () => undefined,
  complete: () => undefined,
  next: () => undefined,
  start: () => undefined
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem('authToken', 'test-token');
  localStorage.setItem('user', JSON.stringify(testUser));
  localStorage.setItem('userOptions', JSON.stringify({}));
  localStorage.setItem('userProducts', JSON.stringify([]));
  localStorage.setItem(
    'userTourPage',
    JSON.stringify(Array.from({ length: 1000 }, (_, page) => ({ page })))
  );
  localStorage.setItem('sendType', '1');
  localStorage.setItem('productType', '1');
  localStorage.setItem('bulletin', '2');

  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      { provide: ActivatedRoute, useValue: activatedRouteStub },
      { provide: NgbActiveModal, useValue: modalRefStub },
      { provide: NgbModal, useValue: modalServiceStub },
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: modalRefStub },
      { provide: ShepherdService, useValue: shepherdServiceStub },
      {
        provide: FormStorageService,
        useValue: {
          saveForm: () => Promise.resolve(),
          getForm: () => Promise.resolve(encryptedStep2),
          deleteForm: () => Promise.resolve(),
          clearAll: () => Promise.resolve()
        }
      }
    ]
  });
});
