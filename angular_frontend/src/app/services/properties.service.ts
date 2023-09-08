import { Injectable } from '@angular/core';
import { DbConnectionService } from './db-connection.service';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  public properties: Properties;

  constructor (private db: DbConnectionService) {
    this.fetchProperties();
  }

  fetchProperties(){
    this.db.getProperties().then((r: Properties) => {
      this.properties = r;
    });
  }
}

export interface Properties {
  "Conversation System": string[],
  "Frequency": string[],
  "Listing Kind": string[],
  "Listing Type": string[],
  "Price Calculation": string[],
  "Price Discovery": string[],
  "Quantity": string[],
  "Revenue Source": string[],
  "revenue Stream": string[],
  "Review System": string[],
  "UserType": string[],
}
