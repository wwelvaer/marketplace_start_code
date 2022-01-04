import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  error: string;
  form: FormGroup;

  fileName: string;
  imgSrc: string;
  imgError: string;

  constructor(public user: UserService,
    private route: Router,
    private db: DbConnectionService,
    private image: ImageService) {
      // redirect to login page when not logged in
      if (!user.isLoggedIn())
        this.route.navigateByUrl("/login")
      // initialize form fields
      this.form = new FormGroup({
        firstName: new FormControl(),
        lastName: new FormControl(),
        email: new FormControl(),
        userName: new FormControl(),
        gender: new FormControl(),
        address: new FormControl(),
        birthDate: new FormControl(),
        phoneNumber: new FormControl(),
      });
    }

  ngOnInit(): void {
    // get user data
    this.db.getUserData(this.user.getId(), this.user.getLoginToken())
      .then(user => {
        Object.keys(user).forEach(x => {
          if (x === 'profilePicture')
            this.imgSrc = user[x]
          else
            // fill out form with userdata
            this.form.get(x).setValue(user[x])
        })
      })
      .catch(r => this.error = r.error.message);
  }

  // onSubmit function
  updateProfile(){
    // collect new userdata
    let v = this.form.getRawValue()
    // add profile picture
    v['profilePicture'] = this.imgSrc;
    // send new userdata to db
    this.db.postUserData(this.user.getId(), this.user.getLoginToken(), v)
      .then(_ =>{
        // update userdata locally
        this.user.setUser({
          id: this.user.getId(),
          userName: v.userName,
          accessToken: this.user.getLoginToken()
        })
        this.route.navigateByUrl("/")
      })
    .catch(err => this.error = err.error.message)
  }

  // select file
  fileSelected(ev){
    // no files selected
    if (ev.target.files.length === 0)
      return;
    // reset variables
    this.imgError = undefined;
    this.imgSrc = undefined;
    let f: File = <File>ev.target.files[0];
    this.fileName = f.name;
    // convert image to standard format
    this.image.convertFileToJpegBase64(f, (c) => {
      this.imgSrc = c;
    }, (err) => {
      this.imgError = err;
    }, 300, 300)
  }
}
