import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular'
import { localUser, addUser, newMessage, users, validToken } from './graphqlDashboard';
import { DataServiceService } from '../../services/data-service.service';
import { ChatComponent } from '../chat/chat.component';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [FlexLayoutModule, NgIf, FontAwesomeModule, ChatComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  error: any;
  loading: boolean = true;
  localUserDetails!: any;
  tokenValidation: boolean = false;
  users: any[] = [];
  recentMessage: any[] = [];
  userId: any = sessionStorage.getItem('id');
  token: any = sessionStorage.getItem('token');

  constructor(private apollo: Apollo, private dataService: DataServiceService) { }
  ngOnInit(): void {
    this.localUser();
    this.tokenValidator();
    this.userList(Number(sessionStorage.getItem('id')));
    this.newUser();
    // this.newMessage();
  }

  localUser() {
    this.apollo.subscribe({
      query: localUser,
      context: {
        headers: {
          Authorization: this.token
        }
      }
    }).subscribe({
      next: ({ data }: any) => {
        console.log(data.user);
        this.localUserDetails = data.user;
      },
      error: (error) => {
        console.error('Subscription error:', error);
      }
    });
  }

  tokenValidator() {
    this.apollo.subscribe({
      query: validToken,
      context: {
        headers: {
          Authorization: this.token
        }
      }
    }).subscribe({
      next: ({ data }: any) => {
        this.tokenValidation = true;
      },
      error: (error) => {
        this.loading = false;
        this.tokenValidation = false;
        console.error('Subscription error:', error);
        const errorMessage = error?.message || 'Something went wrong.';
        this.error = errorMessage;
      }
    });
  }

  userList(id: number) {
    this.apollo.watchQuery({
      query: users,
      variables: {
        userId: id
      },
      context: {
        headers: {
          'Authorization': this.token
        },
      }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        this.users = data.friends
      }
    });
  }
  newUser() {
    this.apollo.subscribe({
      query: addUser
    }).subscribe(({ data, error }: any) => {
      this.loading = false;
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        this.users = [...this.users, data.addUser]
      }
    });
  }

  // newMessage() {
  //   this.apollo.subscribe({
  //     query: newMessage
  //   }).subscribe(({ data, error }: any) => {
  //     this.loading = false;
  //     if (error) {
  //       console.error("Error fetching new message:", error);
  //     } else {
  //       console.log("New message received:", data.newMessage);

  //       // Update the message content in the users list
  //       this.users = this.users.map(user => {
  //         if (user.id === data.newMessage.userId) {
  //           return {
  //             ...user,
  //             message: { content: data.newMessage.content } // Update message content
  //           };
  //         }
  //         return user;
  //       });
  //     }
  //   });
  // }


  receiverId(id: number, name: string) {
    this.dataService.receiver.next({ id, name })
  }
}
