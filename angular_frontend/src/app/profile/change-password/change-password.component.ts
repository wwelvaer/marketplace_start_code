import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  error: string = ""

  constructor(private db: DbConnectionService,
    private user: UserService,
    private route: Router) {
    // redirect to login page when not logged in
    if (!user.isLoggedIn())
      this.route.navigateByUrl("/login")
    // initialize form fields
    this.form = new FormGroup({
      oldPassword: new FormControl(),
      newPassword: new FormControl(),
      repeatPassword: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  // onSubmit function
  changePassword(){
    // collect form values
    let v = this.form.getRawValue();
    this.db.changePassword(v.oldPassword, v.newPassword, this.user.getLoginToken())
      .then(_ => {
        // go to profile page
        this.route.navigateByUrl('/profile')
      }).catch(r => this.error = r.error.message);
  }
}
