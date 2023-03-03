import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { CookieService } from 'ngx-cookie-service';
import { ListingsComponent } from './listings/listings.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatNativeDateModule } from '@angular/material/core';
import { ListingDetailComponent } from './listings/listingdetail/listingdetail.component';
import { CreateEditListingComponent } from './listings/createeditlisting/createeditlisting.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { CategoriesComponent } from './categories/categories.component';
import { MatIconModule } from '@angular/material/icon';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactiondetailComponent } from './transactions/transactiondetail/transactiondetail.component';
import { TaxonomyComponent } from './taxonomy/taxonomy.component';
import { TaxonomyModule } from './taxonomy/taxonomy.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    ListingsComponent,
    ListingDetailComponent,
    CreateEditListingComponent,
    ChangePasswordComponent,
    CategoriesComponent,
    TransactionsComponent,
    TransactiondetailComponent,
    TransactiondetailComponent,
    TaxonomyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    TaxonomyModule
  ],
  providers: [CookieService,
    MatDatepickerModule,
    MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
