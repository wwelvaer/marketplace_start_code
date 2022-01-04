import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbConnectionService } from './services/db-connection.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Marketplace';
  notifications: object[] = [];
  timeToRefresh = 5000; // time in ms

  constructor(public user: UserService,
    private db: DbConnectionService,
    private router: Router){
      this.fetchNotifications();
      // repeatedly check for notifications
      setInterval(() => {
        this.fetchNotifications();
      }, this.timeToRefresh);

  }

  // turn notification into message
  getNotificationMessage(notification: object): string{
    switch (notification['type']) {
      case 'new transaction':
        return `A new transaction was made on your ${notification['transaction'].listing.name}`
      case 'cancellation':
        if (notification['transaction'].customerID === this.user.getId())
          return `Your transaction on ${notification['transaction'].listing.name} has been cancelled`
        else
          return `A transaction on your ${notification['transaction'].listing.name} has been cancelled`
      case 'payment confirmation':
        return `Your payment on ${notification['transaction'].listing.name} has been confirmed`
      case 'reviewable':
        return `You can review your recent transaction of ${notification['transaction'].listing.name}`
      default:
        break;
    }
  }

  // onClick function
  clickedNotification(notification: object){
    // mar notification as viewed
    this.db.markNotificationAsViewed(notification['notificationID'], this.user.getLoginToken()).then(_ => {
      // navigate to page according to notification
      switch (notification['type']) {
        case 'new transaction':
          // go to detail page of listing
          this.router.navigate(['/listings/details', notification['transaction'].listingID, 'transactions'])
          break;
        case 'cancellation':
          if (notification['transaction'].customerID === this.user.getId())
            // go to my transactions
            this.router.navigate(['/listings'], {queryParams: { transactions: true }})
          else
            // go to detail page of listing
            this.router.navigate(['/listings/details', notification['transaction'].listingID, 'transactions'])
          break;
        case 'payment confirmation':
        case 'reviewable':
          // go to my transactions
          this.router.navigate(['/listings'], {queryParams: { transactions: true }})
          break;
        default:
          break;
      }
    })
  }

  // get notifications and sort recent to last
  fetchNotifications() {
    if (this.user.isLoggedIn())
      this.db.getUserNotifications(this.user.getLoginToken()).then(r => this.notifications = r['notifications'].sort((a, b) => b['notificationID'] - a['notificationID']))
  }

  getUnreadNotificationsAmount(): number{
    return this.notifications.filter(x => !x['viewed']).length;
  }
}
