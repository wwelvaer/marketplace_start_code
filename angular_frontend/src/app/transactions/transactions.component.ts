import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
import { TransactiondetailComponent } from './transactiondetail/transactiondetail.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  hasCancelled: boolean = false;
  form: FormGroup;
  transactions: [];
  rating: number = 0; // selected rating for review
  selectedTransactionForReview: number = -1;
  properties = {};

  constructor(
    private db: DbConnectionService,
    private user: UserService,
    private route: ActivatedRoute,
    public image: ImageService,
    public router: Router) {
    this.form = new FormGroup({
      comment: new FormControl('')
    });
  }

  ngOnInit(): void {
    console.log(this.rating)
    this.fetchTransactions();
    this.db.getProperties().then(r => {
      this.properties = r
    })
  }

  fetchTransactions() {
    this.db.getUserTransactions(this.user.getLoginToken())
      .then(t => {
        //what is this? 
        this.transactions = t['transactions'].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map(x => { return { ...x, ...x.listing } })
        console.log(this.transactions)
      })

  }

  // cancel transaction
  cancelTransaction(transactionID: number) {
    this.db.cancelTransaction(transactionID, this.user.getLoginToken())
      .then(_ => this.fetchTransactions()) // update transactionInfo
  }

  postReview() {
    console.log(this.rating)
    let v = this.form.getRawValue();
    v['score'] = this.rating;
    this.db.postReview(this.user.getLoginToken(), this.selectedTransactionForReview, v).then(r => {
      this.router.navigateByUrl('/listings/details/' + r['listingID']);
    })
  }

}
