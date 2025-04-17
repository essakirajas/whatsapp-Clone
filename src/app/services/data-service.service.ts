import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor() { }
  receiver: BehaviorSubject<any> = new BehaviorSubject<any>({
    id: 0,
    name: ''
  });

}
