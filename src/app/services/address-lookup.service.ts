import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface AddressSuggestion {
  id: string;
  address: string;
  houseNumber: string;
  city: string;
  postcode: string;
  displayName: string;
}

interface PhotonFeatureCollection {
  features?: PhotonFeature[];
}

interface PhotonFeature {
  properties?: {
    osm_type?: string;
    osm_id?: number;
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    postcode?: string;
    countrycode?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AddressLookupService {
  private readonly endpoint = 'https://photon.komoot.io/api/';

  constructor(private http: HttpClient) {}

  searchItalianAddresses(query: string, requestedAddress: string): Observable<AddressSuggestion[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', '8')
      .set('bbox', '6.6,35.4,18.6,47.1');

    return this.http.get<PhotonFeatureCollection>(this.endpoint, { params }).pipe(
      map(response => this.toSuggestions(
        response.features ?? [],
        this.extractHouseNumber(requestedAddress)
      ))
    );
  }

  private toSuggestions(features: PhotonFeature[], requestedHouseNumber: string): AddressSuggestion[] {
    const suggestions = features
      .filter(feature => feature.properties?.countrycode?.toUpperCase() === 'IT')
      .filter(feature => {
        const resultHouseNumber = feature.properties?.housenumber?.trim() || '';
        return !requestedHouseNumber
          || !resultHouseNumber
          || this.normalizeHouseNumber(resultHouseNumber) === this.normalizeHouseNumber(requestedHouseNumber);
      })
      .map(feature => {
        const properties = feature.properties!;
        const street = properties.street || properties.name || '';
        const houseNumber = properties.housenumber || '';
        const address = [street, houseNumber].filter(Boolean).join(' ').trim();
        const city = properties.city?.trim() || '';
        const postcode = properties.postcode?.trim() || '';

        return {
          id: `${properties.osm_type ?? ''}-${properties.osm_id ?? ''}-${address}-${postcode}`,
          address,
          houseNumber,
          city,
          postcode,
          displayName: [address, postcode, city].filter(Boolean).join(', ')
        };
      })
      .filter(suggestion => !!suggestion.address && !!suggestion.city && !!suggestion.postcode);

    return suggestions.filter((suggestion, index) =>
      suggestions.findIndex(candidate => candidate.displayName === suggestion.displayName) === index
    ).slice(0, 6);
  }

  private extractHouseNumber(address: string): string {
    const matches = address.match(/\b\d+[a-z]?(?:[\/-][a-z0-9]+)?\b/gi) ?? [];
    const possibleHouseNumbers = matches.filter(value => !/^\d{5}$/.test(value));
    return possibleHouseNumbers.at(-1) ?? '';
  }

  private normalizeHouseNumber(value: string): string {
    return value.replace(/\s+/g, '').toUpperCase();
  }
}
