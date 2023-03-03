import { Injectable } from '@angular/core';
import { DbConnectionService } from './db-connection.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  properties = {}
  private db: DbConnectionService

  constructor() { }

  // fetchProperties() {
  //   this.db.getProperties().then (r => {
  //     (
  //       r['properties'].forEach(property => 
  //         this.properties[property.dimension] = [property.dimensionValue]
  //     ))
  //     console.log("here")
  //     }
  //   );
  //   //console.log(this.properties)
  //   return this.properties
  // }

}

