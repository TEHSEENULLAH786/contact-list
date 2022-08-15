import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact-list-service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contactList:any
  contactDetail = new Array<any>()
  myData: any=[];
  constructor(
    private ContactService: ContactService,
  ) { }

  ngOnInit(): void {
    this.getContactList()
    this.postContactList(1)
  }

  getContactList() {
      this.ContactService.getContactList().subscribe(res => {
        this.contactList = res
      })
    }

  postContactList(id?) {
  this.myData = []
    this.ContactService.postContactList().subscribe(res => {
      this.contactDetail = res
        for (let i = 0; i < this.contactDetail.length; i++) {
          if(this.contactDetail[i]["id"] == id){
            this.myData.push(this.contactDetail[i]);
          }
       }
       
    })
  }

  
}
