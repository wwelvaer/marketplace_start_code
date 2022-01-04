import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';

/**
 *  Component is used to display listings or transactions
 */
@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  activeListings: boolean = true; // show only active listings
  hasCancelled: boolean = false;
  selected: Date | null; // calendar value
  listings = []
  categories = [];
  transactions: boolean = false; // true ->  display transactionInfo; false -> display listingInfo

  // searchbar + sorting
  searchTerm: string = ""; // searchbar value
  sortCol: number = 4; // sort dropdown index value
  sortCols = [ // sort dropdown values + sort functions
    {
      name: 'Name: A -> Z',
      sortFunc: (a, b) => (a.name ? a.name : "").localeCompare(b.name ? b.name : "")
    }, {
      name: 'Name: Z -> A',
      sortFunc: (a, b) => -(a.name ? a.name : "").localeCompare(b.name ? b.name : "")
    }, {
      name: 'Available assets: Low -> High',
      sortFunc: (a, b) => a.availableAssets - b.availableAssets
    }, {
      name: 'Available assets: High -> Low',
      sortFunc: (a, b) => b.availableAssets - a.availableAssets
    }, {
      name: 'Date: Recent -> Oldest',
      sortFunc: (a, b) => -(a.date ? a.date : "").localeCompare(b.date ? b.date : "")
    }, {
      name: 'Date: Oldest -> Recent',
      sortFunc: (a, b) => (a.date ? a.date : "").localeCompare(b.date ? b.date : "")
    }, {
      name: 'Price: Low -> High',
      sortFunc: (a, b) => a.price - b.price
    }, {
      name: 'Price: High -> Low',
      sortFunc: (a, b) => b.price - a.price
    }, {
      name: 'Rating: Best -> Worst',
      sortFunc: (a, b) => b.avgScore - a.avgScore
    }, {
      name: 'Rating: Worst -> Best',
      sortFunc: (a, b) => a.avgScore - b.avgScore
    }];

  // review
  form: FormGroup;
  selectedTransactionForReview: number = -1;
  rating: number = 0; // selected rating for review
  hoverRating: number = 0; // rating shown when hovering

  // pages
  pageLimitOption = [10, 20, 50]
  pageLimitIndex = 1; // selected pageLimit index
  currentPage = 1;

  // lambda function that calculates last page
  maxPage = (listings) => Math.ceil(listings.length / this.pageLimitOption[this.pageLimitIndex])

  // function that filters by category and searchTerm and sorts entries using searchCols
  filteredListings = () => {
    let selectedCategories = this.categories.map(x => x[1]).reduce((acc, val) => acc.concat(val), []).filter(x => x.selected).map(x => x.name);
    return this.listings
    .filter(l => l.status !== "cancelled" || !this.activeListings) // filter only active listings
    .filter(l => selectedCategories.every(x => (l.categories).includes(x))) // categories
    .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 // filter matching search terms
      && (!this.selected || this.selected.getTime() === new Date(u.date).setHours(0, 0, 0, 0))) // when date is selected filter on date
    .sort(this.transactions ? (a, b) => 1 : this.sortCols[this.sortCol].sortFunc) // only listings need to be sorted clientside
  }

  constructor(private db: DbConnectionService,
    private user: UserService,
    private route: ActivatedRoute,
    public image: ImageService,
    public router: Router) {
      this.form = new FormGroup({
        comment: new FormControl('')
      });
     }

  ngOnInit(): void {
    // get categories
    this.db.getCategories().then(r => {
      this.categories = Object.entries(r).map(([k, v]) => [k, v.map((x => {
        return {name: x, selected: false}
      }))])
    })
    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
      // when query has 'transactions' parameter display transactionInfo
      if (!!qMap['params'].transactions)
        this.fetchTransactions();
      else {
        this.transactions = false
        // when query has 'id' parameter display listings from user with id
        let uId = qMap['params'].id;
        if (uId)
            this.db.getUserListings(uId).then(l => {
              this.listings = l['listings']
              this.hasCancelled = this.listings.some(x => x.status === "cancelled")
          })
        else
          this.db.getAllListings().then(l => {
            this.listings = l['listings']
            this.hasCancelled = false;
          })
      }
    })
  }

  // get transactions and sort recent to last
  fetchTransactions(){
    this.db.getUserTransactions(this.user.getLoginToken())
        .then(l => {
          this.listings = l['transactions'].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map(x => {return {...x, ...x.listing}})
          this.hasCancelled = this.listings.some(x => x.status === "cancelled")
          this.transactions = true
        })
  }

  // cancel transaction
  cancelTransaction(transactionID: number){
    this.db.cancelTransaction(transactionID, this.user.getLoginToken())
      .then(_ => this.fetchTransactions()) // update transactionInfo
  }

  postReview(){
    let v = this.form.getRawValue();
    v['score'] = this.rating;
    this.db.postReview(this.user.getLoginToken(), this.selectedTransactionForReview, v).then(r => {
      this.router.navigateByUrl('/listings/details/' + r['listingID']);
    })
  }

}
