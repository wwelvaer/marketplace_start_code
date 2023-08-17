import { Component, ElementRef, ViewChild } from '@angular/core';
import { DbConnectionService } from '../services/db-connection.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  @ViewChild('chat') private myScrollContainer: ElementRef;

  lastMessages: Message[] = [];
  messages: Message[] = [];
  message: string = "";

  selected: number = -1;
  selectedUserName: string = "";

  locked: boolean = false;
  scrollToBottomNeeded: boolean = false;

  timeToRefresh = 1000; // time in ms
  interval;

  constructor(
    private db: DbConnectionService,
    public user: UserService
  ) {
    // repeatedly check for new messages
    this.interval = setInterval(() => {
      this.fetchMessages();
    }, this.timeToRefresh);  
  }

  // scroll to bottom of chat after data change
  ngAfterViewChecked() {        
    if (this.scrollToBottomNeeded){
      this.scrollToBottom();
      this.scrollToBottomNeeded = false;
    }        
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngOnInit() {
    this.db.getLastMessages(this.user.getLoginToken()).then(r => this.lastMessages = r['messages']);
  }

  // stop checking for new messages when leaving page
  ngOnDestroy(){
    clearInterval(this.interval)
  }

  selectPerson(message: Message){
    if (this.locked)
      return;
    this.messages = [];
    this.selected = message.senderID === this.user.getId() ? message.receiverID : message.senderID;
    this.selectedUserName = message.senderID === this.user.getId() ? message.receiver : message.sender;
    this.db.getMessages(this.user.getLoginToken(), this.selected).then(r => {
      this.messages = r['messages'];
      this.scrollToBottomNeeded = true;
    });
    this.message = "";
  }

  fetchMessages(){
    if (this.selected < 0)
      return;
    this.db.getMessages(this.user.getLoginToken(), this.selected).then(r => {
      let m = r['messages'];
      if (m.length > this.messages.length){
        for (let i = this.messages.length; i < m.length; i++)
          this.messages.push(m[i]);
        this.scrollToBottomNeeded = true;
      }
    });
  }

  keyPressed(event){
    if(event.key === "Enter")
      this.sendMessage();
  }

  sendMessage(){
    this.locked = true; // safety while sending message
    this.db.postMessage(this.user.getLoginToken(), this.selected, this.message).then(r => {
      let m = r['message'];
      this.message = "";
      this.messages.push(m);
      for (let i = 0; i < this.lastMessages.length; i++){
        if (this.lastMessages[i].receiverID === this.selected || this.lastMessages[i].senderID === this.selected){
          // set chat to top of recent messages list
          this.lastMessages.unshift(...this.lastMessages.splice(i, 1));
          // update last message
          this.lastMessages[0].message = m.message;
          break;
        }
      }
      this.locked = false;
      this.scrollToBottomNeeded = true;
    })
  }

  simplifyDate(d: string){
    return d.split("T").join(" ").split(".")[0]
  }
}

export interface Message {
  messageID: number,
  receiverID: number,
  senderID: number,
  message: string,
  createdAt: Date,
  sender: string,
  receiver: string
}

