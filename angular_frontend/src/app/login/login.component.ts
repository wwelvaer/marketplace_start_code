import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DbConnectionService } from '../services/db-connection.service';
import { User, UserService } from '../services/user.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error: string = ""

  constructor(private db: DbConnectionService,
    private user: UserService,
    private location: Location) {
    // initialize form fields
    this.form = new FormGroup({
      login: new FormControl(),
      password: new FormControl(),
      keepSignedIn: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  // onSubmit function
  logIn(){
    // collect form values
    let d = this.form.getRawValue();
    // sign in
    this.db.signIn(d.login, d.password)
      .then((r: User) => {
        this.user.storeCookie = d.keepSignedIn
        // set user locally
        this.user.setUser(r);
        // go back to previous page
        this.location.back();
      })
      .catch(r => this.error = r.error.message);
  }
}
