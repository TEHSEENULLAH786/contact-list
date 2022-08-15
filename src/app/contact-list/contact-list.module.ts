import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactListRoutingModule } from './contact-list-routing.module';
import { ContactListComponent } from './contact-list/contact-list.component';


@NgModule({
  declarations: [ContactListComponent],
  imports: [
    CommonModule,
    ContactListRoutingModule
  ]
})
export class ContactListModule { }
