import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { User, UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup;
  error: string= "";

  fileName: string;
  imgSrc: string;
  imgError: string;

  constructor(private db: DbConnectionService,
    private route: Router,
    private image: ImageService) {
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
        password: new FormControl(),
        repeatPassword: new FormControl()
      });
   }

  ngOnInit(): void {
  }

  // onSubmit function
  signUp(){
    // collect form values
    let v = this.form.getRawValue();
    delete v.repeatPassword; // only used for clientside verification
    // add profile picture
    v['profilePicture'] = this.imgSrc;
    // send data
    this.db.signUp(v)
      .then(_ => {
        // go to login page
        this.route.navigateByUrl('/login')
      })
      .catch(r => this.error = r.error.message);
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
