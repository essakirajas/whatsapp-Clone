import { ViewChild, ElementRef, Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { Apollo } from 'apollo-angular';
import { Messages, messages, sendMessage, receiverDetails } from './graphqlChat';
import { DataServiceService } from '../../services/data-service.service';
import { TimePipePipe } from '../../pipes/time-pipe.pipe';
import { DatePipe } from '../../pipes/date.pipe';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, FlexLayoutModule, TimePipePipe, DatePipe, SafeUrlPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @ViewChild('scrollMe', { static: false }) myScrollContainer!: ElementRef;

  users: any[] = [];
  messages: any[] = [];
  uniqueDate: any[] = [];
  error: any;
  loading: boolean = true;
  userId: any = Number(sessionStorage.getItem('id'));
  receiverId!: any;
  receiverName!: string;
  receiverDetails: any;
  messageContent: string = '';

  constructor(private apollo: Apollo, private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.dataService.receiver.subscribe(data => {
      if (this.userId != 0 && data.id != 0) {
        this.receiverId = data.id;
        this.fetchreceiverDetails(Number(data.id));
        this.fetchMessages(Number(this.userId), Number(data.id));
        this.subscribeToNewPost(Number(this.userId), Number(data.id));
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const container = this.myScrollContainer?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }


  fetchreceiverDetails(receiverId: number) {
    this.apollo.watchQuery({
      query: receiverDetails,
      variables: { receiverId }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (!error) {
        this.receiverDetails = data.userDetails;
      }
    });
  }

  sendMessage() {
    const content = this.messageContent.trim();
    if (!content) null;
    this.apollo.mutate({
      mutation: sendMessage,
      variables: {
        newMsg: { content, userId: Number(this.userId), receiverId: Number(this.receiverId) },
        file: this.selectedFile
      },
      context: {
        headers: {
          'apollo-require-preflight': true
        },
        useMultipart: true,
      }
    }).subscribe({
      next: () => {
        this.messageContent = ''; // Clear input
        this.selectedFile = null; // Clear input
      },
      error: (error) => {
        console.error('Error sending message:', error);
      }
    });
  }

  fetchMessages(sender: number, receiver: number) {
    // this.receiverName = name;
    this.apollo.watchQuery({
      query: messages,
      variables: { sender, receiver }
    }).valueChanges.subscribe(({ data, error }: any) => {
      this.loading = false;
      if (!error) {
        this.messages = this.groupMessagesByDate(this.fileType(data.messages));
        // console.log(this.messages);
      }
    });
  }

  fileType(messages: any[]) {
    return messages.map(msg => {
      let fileType = null;
      const url = msg.fileUrl;
      let type = url ? url.split('.').at(-1) : null;

      if (['jpg', 'png', 'webp'].includes(type)) {
        fileType = 'image';
      } else if (['pdf', 'docx'].includes(type)) {
        fileType = 'files';
      } else if (['mp4'].includes(type)) {
        fileType = 'video';
      }
      return { ...msg, fileType };
    });
  }


  groupMessagesByDate(messages: any[]): any[] {
    const seenDates = new Set();
    return messages.map(msg => {
      const dateOnly = msg.createdAt[0];
      const showDate = !seenDates.has(dateOnly);
      if (showDate) seenDates.add(dateOnly);
      return { ...msg, dateOnly, showDate };
    });
  }

  subscribeToNewPost(sender: number, receiver: number) {
    this.apollo.subscribe({
      query: Messages,
      variables: { userId: sender, receiverId: receiver }
    }).subscribe(({ data }: any) => {
      if (data && data.Messages) {
        console.log("New msg received:", data.Messages);
        const updated = [...this.messages, data.Messages];
        this.messages = this.groupMessagesByDate(this.fileType(updated));
      }
    }, error => {
      console.error("Subscription error:", error);
    });
  }

  
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }



}

