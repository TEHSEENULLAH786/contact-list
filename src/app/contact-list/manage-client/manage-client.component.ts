import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { manageClientService } from 'src/app/services/manage-client-service';
import { DeleteAlertDialogComponent } from '../../ums-dialogs/delete-dialog/delete-alert-dialog.component';
import { LocalService } from 'src/app/services/local.service';
import { ConstantService } from 'src/app/services/constant.service';
import { AlertService } from '../../../services/alert.service';


@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrls: ['./manage-client.component.scss']
})
export class ManageClientComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true })
  hide: false;
  clientData = new Array<any>();
  displayedColumns: string[] = ['image', 'title', 'description', 'companyName', 'email', 'phoneNumber', 'city', 'country', 'action'];
  dataSource = new MatTableDataSource<any>(this.clientData);
  hideElement: boolean = true;
  paginator!: MatPaginator;
  constantList: string[];
  editClientData: any;
  countData: any;
  searchBox: boolean = false;
  currentDeletedIndex: any;
  deletedId: any;
  deleteType: any;


  constructor(
    private manageClientService: manageClientService,
    public dialog: MatDialog,
    private localService: LocalService,
    private constantService: ConstantService,
    private alertService:AlertService
  ) { }


  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getManageClient()
    // This onbeforeunload function is used to execute ngOnDestroy when routing page URl
    window.onbeforeunload = () => this.ngOnDestroy();
  }


  formData(val) {
    if (!this.editClientData) {
      this.manageClientService.addClient(val).subscribe(res => {
        if (res['message'] == 'Success') {
          this.getManageClient()
          this.alertService.showSuccess("Create/Update", "Client");
        } else {
          this.alertService.showError("Create/Update", "Client");
        }
      })
    }
    else if (this.editClientData === 'search') {
      localStorage.setItem('forFilterApplied', JSON.stringify(val))
      this.getManageClient(val)
    }
    else {
      this.getUpdateClient(val)
    }
  }

  addItem(val) {
    this.hideElement = val
  }

  getUpdateClient(val) {
    this.manageClientService.updateClient(val).subscribe(res => {
      if (res['message'] == 'Success') {
        this.getManageClient()
        this.alertService.showSuccess("Create/Update", "Client")
      } else {
        this.alertService.showError("Create/Update", "Client");

      }


    })
  }

  getManageClient(val?, pageNo?, itemsPerPage?) {
    const data = {
      client: {
        "title": val?.title ? val?.title : null,
        "description": val?.description ? val?.description : null,
        "companyName": val?.companyName ? val?.companyName : null,
        "email": val?.email ? val?.email : null,
        "phoneNumber": val?.phoneNumber ? val?.phoneNumber : null,
        "logo": val?.logo ? val?.logo : null,
        "city": val?.city ? val?.city : null,
        "country": val?.country ? val?.country : null
      },
      "pagination": {
        "pageNo": pageNo ? pageNo : 0,
        "itemsPerPage": itemsPerPage ? itemsPerPage : 10
      }
    }
    this.manageClientService.getManageClient(data).subscribe(res => {
      if (res['message'] == 'Success') {
        this.clientData = res['data'];
        this.countClient(val)
      } else {
        this.clientData = res['data']
        this.countClient(val)
      }
    }, err => {
      console.error('err: ', err);
    });
  }

  openAddDataSearch(val?) {
    if (val) {
      this.editClientData = val
    } else {
      this.editClientData = ''
    }
    this.hideElement = false
  }

  imageSrc(element) {
    let src = ""
    if (element.logo) {
      src = element.logo

      if (src.indexOf("glbe") > -1) {
        src = src.replace("glbe", "devbe")
      }
    } else {
      src = "assets/theme1/custom-files/img/default_thumb/defaultproject.png";
    }
    return src
  }

  editFormData(editData) {
    this.editClientData = editData
    this.hideElement = false
  }

  countClient(val?) {

    const data = {
      client: {
        "title": val?.title ? val?.title : null,
        "description": val?.description ? val?.description : null,
        "companyName": val?.companyName ? val?.companyName : null,
        "email": val?.email ? val?.email : null,
        "phoneNumber": val?.phoneNumber ? val?.phoneNumber : null,
        "logo": val?.logo ? val?.logo : null,
        "city": val?.city ? val?.city : null,
        "country": val?.country ? val?.country : null
      }
    }
    this.manageClientService.countClient(data).subscribe(res => {
      if (res['message'] == 'Success') {
        this.countData = res['data'];
      } else {
        this.countData = 0
      }
    }, err => {
      console.error('err: ', err);
    });
  }

  onPageChange(event?) {
    let pageNo = event?.pageIndex
    let pageSize = event?.pageSize
    this.getManageClient(0, pageNo, pageSize)
  }

  onDeleteUser() {
    this.manageClientService.deleteClient(this.deletedId).subscribe((data: any) => {
      if (data['message'] == 'Success') {
        this.getManageClient()
        this.alertService.showSuccess("Delete", "Client");
      } else {
        this.alertService.showError("Delete", "Client");
      }
    });
  }

  openDeleteDialog(deletetype, deletedId, index) {
    this.deleteType = deletetype;
    this.deletedId = deletedId;
    this.currentDeletedIndex = index;
    const dialogRef = this.dialog.open(DeleteAlertDialogComponent, {
      minWidth: "40%",
      data: { title: "Client" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.onDeleteUser();
      }
    });
  }

  getConstants(formId) {
    this.constantService.getFormConstants(formId).subscribe((data: string) => {
      this.constantList = data['data'] as string[];
    });
  }

  verifyLabel(label) {
    return this.localService.verifyLabel(label, this.constantList);
  }

  ngOnDestroy(){
    debugger
   localStorage.removeItem('forFilterApplied')
  }
}


