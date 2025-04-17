import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Apollo } from 'apollo-angular';
import { ValidateUser } from './graphqlPhoneNo'
import { CodeComponent } from '../code/code.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phone-no',
  imports: [CommonModule, FlexLayoutModule, CodeComponent],
  templateUrl: './phone-no.component.html',
  styleUrl: './phone-no.component.scss'
})
export class PhoneNoComponent {
  error: any;
  loading: boolean = true;
  userFound!: boolean;
  phoneNo!: number;

  constructor(private apollo: Apollo, private router: Router) { }

  register() {
    this.router.navigate(['/register']);
  }

  ValidateUser(phoneNo: any) {
    phoneNo = Number(phoneNo);
    this.apollo.watchQuery({
      query: ValidateUser,
      variables: {
        phoneNo
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        if (data.validUser) {
          this.userFound = true;
          this.phoneNo = Number(phoneNo);
        }
        else {
          this.userFound = false;
        }
        console.log(data.validUser);
      }
    });
  }

}
