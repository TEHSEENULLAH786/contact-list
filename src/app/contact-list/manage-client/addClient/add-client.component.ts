import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { NonInterceptService } from 'src/app/services/non-intercept.service';
import { LocalService } from 'src/app/services/local.service';
import { ConstantService } from 'src/app/services/constant.service';
import { Constants } from 'src/app/utils/Constants';


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string>();
  @Output() newFormEvent = new EventEmitter<string>();
  @Input() editData: any;
  allimages = new Array<any>();
  action: string = 'Save'
  heading: string = 'Add Client'
  patchFilter: any
  constantList: string[];
  clientForm: FormGroup
  constructor(
    private fb: FormBuilder,
    private nonInterceptService: NonInterceptService,
    private alertService: AlertService,
    private localService: LocalService,
    private constantService: ConstantService,
  ) {
    this.clientForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      companyName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      city: [''],
      country: [''],
      logo: [''],
      clientId: [Number]
    })
  }

  ngOnInit(): void {
    this.getConstants(Constants.USER_FORM_ID);
    if (this.editData === 'search') {
      this.action = 'Apply Filter'
      this.heading = 'Search Client'
      this.patchFilter = JSON.parse(localStorage.getItem('forFilterApplied'))
      this.clientForm.controls['title'].setValue(this.patchFilter.title)
      this.clientForm.controls['description'].setValue(this.patchFilter.description)
      this.clientForm.controls['companyName'].setValue(this.patchFilter.companyName)
      this.clientForm.controls['email'].setValue(this.patchFilter.email)
      this.clientForm.controls['phoneNumber'].setValue(this.patchFilter.phoneNumber)
      this.clientForm.controls['logo'].setValue(this.patchFilter.logo)
      this.clientForm.controls['city'].setValue(this.patchFilter.city)
      this.clientForm.controls['country'].setValue(this.patchFilter.country)
      this.clientForm.controls['clientId'].setValue(this.patchFilter.clientId)

    }
    if (this.editData != 'search' && this.editData) {
      this.action = 'Update'
      this.heading = 'Update Client'
      this.clientForm.controls['title'].setValue(this.editData.title)
      this.clientForm.controls['description'].setValue(this.editData.description)
      this.clientForm.controls['companyName'].setValue(this.editData.companyName)
      this.clientForm.controls['email'].setValue(this.editData.email)
      this.clientForm.controls['phoneNumber'].setValue(this.editData.phoneNumber)
      this.clientForm.controls['city'].setValue(this.editData.city)
      this.clientForm.controls['country'].setValue(this.editData.country)
      this.clientForm.controls['clientId'].setValue(this.editData.clientId)
      this.clientForm.controls['logo'].setValue(this.editData.logo)
      if (this.editData.logo.includes('https')) {
        let imgObject = { url: this.editData.logo }
        this.allimages.push(imgObject);
      }
    }
  }

  get title() {
    return this.clientForm.get('title')
  }

  submitForm(val, bool) {
    localStorage.removeItem('forFilterApplied')
    this.newFormEvent.emit(val)
    this.newItemEvent.emit(bool);
  }

  cancelForm(value) {
    this.newItemEvent.emit(value);
  }

  ngOnDestroy(): void {
    this.editData = ''
    this.clientForm.reset()
  }

  clearFilter() {
    this.clientForm.reset()
    let val = ''
    this.newFormEvent.emit(val);
  }

  fileUploadExtensions = '.png,.jpeg, .jpg'
  fileType = "image"
  uploadImage(fileInput) {
    let formData = new FormData();
    let uploadFile = <File>fileInput.target.files[0]
    formData.append('file', uploadFile);
    let fileType = uploadFile?.type?.split('/')[1];
    let fileName = uploadFile?.name
    let fileExt = ''
    formData.append("fileType", fileType);
    if (uploadFile == undefined) {
      this.clientForm.get('logo').setValue(null);
      return
    }
    if (fileName?.includes('.')) {
      let arr = fileName.split('.')
      fileExt = '.' + arr[arr.length - 1]
    }
    if (!this.fileUploadExtensions.includes(fileExt)) {
      this.alertService.showCustomInfoAlert('Please upload file of extension ' + this.fileUploadExtensions);
      return
    }
    this.nonInterceptService.uploadFile(formData, fileType).subscribe(res => {
    }, error => {
      let imgObject = { url: error.error.text }
      this.allimages.splice(0, 1, imgObject);
      this.clientForm.get('logo').setValue(error.error.text)
    });
  }

  get f() {
    return this.clientForm.controls;
  }

  removeImage() {
    this.clientForm.get('logo').setValue("");
  }

  getConstants(formId) {
    this.constantService.getFormConstants(formId).subscribe((data: string) => {
      this.constantList = data['data'] as string[];
    });
  }
  
  verifyLabel(label) {
    return this.localService.verifyLabel(label, this.constantList);
  }


}



