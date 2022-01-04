import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  // backend connection settings
  backendPort = 3000;
  url = 'http://localhost:' + this.backendPort;

  constructor(private http: HttpClient) {
  }

  // create HTTP header with webtoken
  getTokenHeader(token: string){
    return new HttpHeaders().set('x-access-token', token);
  }

  /**
   * sign user in
   * @param login
   * @param password
   * @returns http response promise
   */
  signIn(login: string, password: string){
    return this.http.post(`${this.url}/api/auth/signin`, {'login': login, 'password': password}).toPromise();
  }

  /**
   * sign user up (creates user)
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field password
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */
  signUp(fields: Object){
    return this.http.post(`${this.url}/api/auth/signup`, fields).toPromise();
  }

  /**
   * get userdata
   * @param id userID
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserData(id: number, userToken: string){
    return this.http.get(`${this.url}/api/userdata?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * update userdata
   * @param id userID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */
  postUserData(id: number, userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/userdata?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get profile picture
   * @param userID userID
   * @returns http response promise
   */
  getProfilePicture(userID: number){
    return this.http.get(`${this.url}/api/userPicture?id=${userID}`).toPromise();
  }

  /**
   * change password
   * @param oldPassword
   * @param newPassword
   * @param userToken webtoken
   * @returns http response promise
   */
  changePassword(oldPassword: string, newPassword: string, userToken: string){
    return this.http.post(`${this.url}/api/user/changePassword`, {oldPassword: oldPassword, newPassword: newPassword}, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all listings
   * @returns http response promise
   */
  getAllListings(){
    return this.http.get(`${this.url}/api/listings`).toPromise();
  }

  /**
   * get all listings made by given user
   * @param userId userID
   * @returns http response promise
   */
  getUserListings(userId: number){
    return this.http.get(`${this.url}/api/listings/user?id=${userId}`).toPromise();
  }

  /**
   * create listing
   * @param userToken webtoken
   * @param fields (not required)
   *  @field name
   *  @field description
   *  @field availableAssets
   *  @field date
   *  @field price
   *  @field picture: image in base64 format
   *  @field location
   * @returns http response promise
   */
  createListing(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get listingdata
   * @param id listingID
   * @returns http response promise
   */
  getListing(id: number){
    return this.http.get(`${this.url}/api/listing?id=${id}`).toPromise();
  }

  /**
   * update listingdata
   * @param id listingID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field name
   *  @field description
   *  @field availableAssets
   *  @field date
   *  @field price
   *  @field picture: image in base64 format
   *  @field location
   * @returns http response promise
   */
  postListing(id: number,  userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * cancel listing
   * @param id listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  cancelListing(id: number,  userToken: string){
    return this.http.get(`${this.url}/api/listing/cancel?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all transactions on a given listing
   * @param listingID listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  getListingTransactions(listingID: number, userToken: string){
    console.log("Ja tot ier")
    return this.http.get(`${this.url}/api/transactions/listing?id=${listingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all transactions made by given user
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserTransactions(userToken: string){
    return this.http.get(`${this.url}/api/transactions/user`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * create transaction
   * @param userToken webtoken
   * @param fields
   *  @field listingID
   *  @field numberOfAssets
   * @returns http response promise
   */
  createTransaction(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/transaction/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * cancels transaction (doesn't delete)
   * @param transactionID transactionID
   * @param userToken webtoken
   * @returns http response promise
   */
  cancelTransaction(transactionID: number, userToken: string){
    return this.http.get(`${this.url}/api/transaction/cancel?id=${transactionID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * confirm payment of transaction
   * @param transactionID transactionID
   * @param userToken webtoken
   * @returns http response promise
   */
  confirmPayment(transactionID: number, userToken: string){
    return this.http.get(`${this.url}/api/transaction/confirmPayment?id=${transactionID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  // get all categories
  getCategories(){
    return this.http.get(`${this.url}/api/categories`).toPromise();
  }

  /**
   * delete category
   * @param name category name
   * @returns http response promise
   */
  deleteCategory(name: string){
    return this.http.post(`${this.url}/api/category/delete`, {name: name}).toPromise();
  }

  /**
   * delete categories with type
   * @param type category type
   * @returns http response promise
   */
  deleteCategoryType(type: string){
    return this.http.post(`${this.url}/api/category/deleteType`, {type: type}).toPromise();
  }

  /**
   * create category
   * @param fields
   *  @field name (required)
   *  @field type
   * @returns http response promise
   */
  createCategory(fields: object){
    return this.http.post(`${this.url}/api/category/create`, fields).toPromise();
  }

  /**
   * // get all notifications from user
   * @param userToken web token
   * @returns http response promise
   */
  getUserNotifications(userToken: string){
    return this.http.get(`${this.url}/api/notifications`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * mark notification as viewed
   * @param notificationID notificationID
   * @param userToken web token
   * @returns http response promise
   */
  markNotificationAsViewed(notificationID: number, userToken: string){
    return this.http.get(`${this.url}/api/notification/markViewed?id=${notificationID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * post a review
   * @param transactionID transactionID
   * @param fields
   *  @field comment
   *  @field score [1-5]
   * @returns http response promise
   */
  postReview(userToken: string, transactionID: number, fields: object){
    return this.http.post(`${this.url}/api/review?id=${transactionID}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all reviews on listing
   * @param ListingID listingID
   * @returns http response promise
   */
  getListingReviews(listingID: number){
    return this.http.get(`${this.url}/api/reviews/listing?id=${listingID}`).toPromise();
  }

  /**
   * get all reviews on user
   * @param userID userID
   * @returns http response promise
   */
  getUserReviews(userID: number){
    return this.http.get(`${this.url}/api/reviews/user?id=${userID}`).toPromise();
  }
}
