import { Component } from '@angular/core';
import { DbConnectionService } from '../services/db-connection.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  constructor(
    private db: DbConnectionService,
    private user: UserService
  ) {
    
  }

  ngOnInit() {
    //console.log("test123");
    //this.db.postMessage(this.user.getLoginToken(), 9, "Dit is een test berichtje").then(console.log);
    this.db.getMessages(this.user.getLoginToken(), 8).then(console.log);
  }
}
