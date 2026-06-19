export interface NavigationItem {
  label: string;
  path?: string;
  icon?: string;
  exact?: boolean;
  keywords?: string[];
  children?: NavigationItem[];
}

export interface NavigationSearchItem {
  label: string;
  path: string;
  group: string;
  keywords: string[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Home',
    path: '/dashboard',
    exact: true
  },
  {
    label: 'Nuova spedizione',
    path: '/nuovaSpedizione',
    keywords: ['crea', 'invio', 'spedire']
  },
  {
    label: 'Stato invii',
    children: [
      { label: 'Raccomandate', path: '/statoInvii/1', keywords: ['tracking', 'raccomandata'] },
      { label: 'Lettere', path: '/statoInvii/2', keywords: ['tracking', 'lettera'] },
      { label: 'Telegrammi', path: '/statoInvii/3', keywords: ['tracking', 'telegramma'] },
      { label: 'Agol', path: '/statoInvii/6', keywords: ['tracking', 'agol'] },
      { label: 'Visure/Certificati', path: '/statoInvii/7', keywords: ['tracking', 'visura', 'certificato'] }
    ]
  },
  {
    label: 'Archivio',
    children: [
      { label: 'Archivio spedizioni', path: '/archivioSpedizioni', keywords: ['storico', 'lotti'] },
      { label: 'Archivio visure/certificati', path: '/archivioVisure', keywords: ['storico', 'visure', 'certificati'] }
    ]
  },
  {
    label: 'Report',
    children: [
      { label: 'Report spedizioni', path: '/reportSpedizioni', keywords: ['statistiche', 'esportazione'] },
      { label: 'Report spedizioni con bollettini', path: '/reportSpedizioniBollettini', keywords: ['statistiche', 'bollettini'] }
    ]
  },
  {
    label: 'Utility',
    children: [
      { label: 'Sincronizzazione Bipiol', path: '/sincBipiol', keywords: ['sync', 'bipiol'] },
      { label: 'Stampa & Unione', path: '/stampaUnione', keywords: ['stampa', 'unione'] },
      { label: 'Unione PDF', path: '/unionePdf', keywords: ['pdf', 'merge'] },
      { label: 'Comprimi PDF', path: '/comprimiPdf', keywords: ['pdf', 'compressione', 'zip'] },
      { label: 'Rendicontazione fatture', path: '/rendicontazioneFatture', keywords: ['fatture', 'contabilita'] },
      { label: 'File di esempio', path: '/fileEsempio', keywords: ['template', 'csv', 'tracciati'] },
      { label: 'Video tutorial', path: '/videoTutorial', keywords: ['guida', 'tutorial'] }
    ]
  },
  {
    label: 'Comunicazioni',
    path: '/comunicazioni',
    keywords: ['messaggi', 'notizie']
  }
];

export const userNavigation: NavigationItem[] = [
  { label: 'Dati personali', path: '/datiPersonali', icon: 'bx-id-card' },
  { label: 'Utenti', path: '/utentiList', icon: 'bx-group' },
  { label: 'Rubrica mittenti', path: '/userSenders', icon: 'bx-send' },
  { label: 'Rubrica destinatari', path: '/rubricaDestinatari', icon: 'bx-book-content' },
  { label: 'Personalizzazione cover', path: '/personalizzazioneCover', icon: 'bx-image' },
  { label: 'Errori notificati', path: '/erroriNotificati', icon: 'bx-error-circle' }
];

export const routeTitles: Record<string, string> = {
  dashboard: 'Home',
  nuovaSpedizione: 'Nuova spedizione',
  userSenders: 'Rubrica mittenti',
  addSender: 'Nuovo mittente',
  modSender: 'Modifica mittente',
  tipoSpedizioneRaccomandata: 'Tipo spedizione raccomandata',
  invioSingoloRaccomandata: 'Raccomandata singola',
  invioSingoloRaccomandata2: 'Mittente raccomandata',
  invioSingoloRaccomandata3: 'Destinatario raccomandata',
  invioSingoloRaccomandata4: 'Documenti raccomandata',
  invioSingoloRaccomandata5: 'Conferma raccomandata',
  invioMultiploRaccomandata: 'Raccomandata multipla',
  invioMultiploRaccomandata2: 'Mittente raccomandata multipla',
  invioMultiploRaccomandata3: 'Destinatari raccomandata multipla',
  invioMultiploRaccomandata4: 'Conferma raccomandata multipla',
  tipoSpedizioneLettera: 'Tipo spedizione lettera',
  invioSingoloLettera: 'Lettera singola',
  invioSingoloLettera2: 'Mittente lettera',
  invioSingoloLettera3: 'Destinatario lettera',
  invioSingoloLettera4: 'Documenti lettera',
  invioSingoloLettera5: 'Conferma lettera',
  invioMultiploLettera: 'Lettera multipla',
  invioMultiploLettera2: 'Mittente lettera multipla',
  invioMultiploLettera3: 'Destinatari lettera multipla',
  invioMultiploLettera4: 'Conferma lettera multipla',
  tipoSpedizioneAgol: 'Tipo spedizione Agol',
  invioSingoloAgol: 'Agol singolo',
  invioSingoloAgol2: 'Mittente Agol',
  invioSingoloAgol3: 'Destinatario Agol',
  invioSingoloAgol4: 'Documenti Agol',
  invioSingoloAgol5: 'Conferma Agol',
  invioMultiploAgol: 'Agol multiplo',
  invioMultiploAgol2: 'Mittente Agol multiplo',
  invioMultiploAgol3: 'Destinatari Agol multiplo',
  invioMultiploAgol4: 'Conferma Agol multiplo',
  invioTelegramma: 'Telegramma',
  invioTelegramma2: 'Mittente telegramma',
  invioTelegramma3: 'Destinatario telegramma',
  invioTelegramma4: 'Conferma telegramma',
  tipoVisura: 'Tipo visura',
  visuraSingola: 'Visura singola',
  visuraSingola2: 'Richiedente visura',
  visuraSingola3: 'Conferma visura',
  invioPacco: 'Pacco',
  invioPacco2: 'Dettagli pacco',
  statoInvii: 'Stato invii',
  errore500: 'Errore interno',
  reportSpedizioni: 'Report spedizioni',
  reportSpedizioniBollettini: 'Report spedizioni con bollettini',
  datiPersonali: 'Dati personali',
  erroriNotificati: 'Errori notificati',
  personalizzazioneCover: 'Personalizzazione cover',
  rubricaDestinatari: 'Rubrica destinatari',
  utentiList: 'Utenti',
  archivioSpedizioni: 'Archivio spedizioni',
  archivioVisure: 'Archivio visure/certificati',
  addRecipient: 'Nuovo destinatario',
  modRecipient: 'Modifica destinatario',
  dettaglioSpedizione: 'Dettaglio spedizione',
  addLogo: 'Nuovo logo',
  addUser: 'Nuovo utente',
  modUser: 'Modifica utente',
  comprimiPdf: 'Comprimi PDF',
  fileEsempio: 'File di esempio',
  rendicontazioneFatture: 'Rendicontazione fatture',
  sincBipiol: 'Sincronizzazione Bipiol',
  stampaUnione: 'Stampa & Unione',
  unionePdf: 'Unione PDF',
  videoTutorial: 'Video tutorial',
  comunicazioni: 'Comunicazioni',
  access: 'Accesso vecchia piattaforma'
};
