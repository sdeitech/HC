import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddNewCareplanAssetsComponent } from '../add-new-careplan-assets/add-new-careplan-assets.component';
import { ClinicalAssetService } from '../services/clinical-asset.service';

@Component({
  selector: 'app-careplan-general-comments',
  templateUrl: './careplan-general-comments.component.html',
  styleUrls: ['./careplan-general-comments.component.scss']
})
export class CareplanGeneralCommentsComponent implements OnInit {
  patientEmpi: any;
  assessmentResult: any = [];
  pageNumber = 1;
  pageSize = 5;
  searchText: string = '';
  totalRecords: number = 0;
  loading: boolean = true;
  first = 0;
  selectedIndex = 0;
  tableSizes = [5, 10, 25, 50, 100];
  sortColumn: any;
  sortOrder: any;
  generalCommentsList: any = [];
  patientData: any;
  typingTimer;
  doneTypingInterval = 1000;
  loaderStatus: boolean = true;

  constructor(private _carePlanService: ClinicalAssetService,
    private ref: DynamicDialogRef,
    public messageService: MessageService, public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.pageNumber = 1;
    this.pageSize = 5;
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;

    this.sortColumn = 'name';
    this.sortOrder = 'ASC';


    this.getGeneralCommentsList();
  }
  addGeneralComment(data: any) {
    var isUpdate = false;
    if (data != null) {
      isUpdate = true;
      data.name = data.description;
      data.id = data.comment_id;
      data.diag_id = 0;
    }

    this.ref = this.dialogService.open(AddNewCareplanAssetsComponent, {
      header: isUpdate ? 'Update General Comment' : 'Add General Comment',
      width: '700px',
      contentStyle: { "max-height": "90vh" },
      data: { pagedata: data, isUpdate: isUpdate, code_key: 'general comment' },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: result.data.message,
          });
          this.getGeneralCommentsList();
        }
        else {
          this.messageService.add({
            severity: 'info',
            summary: result.data.message,
          });
          this.getGeneralCommentsList();
        }
      }
    });
  }
  getGeneralCommentsList() {
    this.pageSize = this.pageSize;
    this.searchText = this.searchText;
    this.loading = true;
    let model =
    {
      pageNumber: this.pageNumber,
      pagesize: this.pageSize,
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder,
      searchText: this.searchText
    }
    this._carePlanService
      .getCarePlanGeneralCommentsData(model)
      .subscribe((response: any) => {
        this.loading = false;
        this.loaderStatus = false;
        this.generalCommentsList = [];
        this.totalRecords = 0;
        if (response.body.length > 0) {
          this.generalCommentsList = response.body
          this.totalRecords = this.generalCommentsList[0].totalrecords;
        }
      })
  }
  loadLazy(event) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    if (event.sortField == undefined) {
      this.sortColumn = 'sort_order';
      this.sortOrder = event.sortOrder == 1 ? 'ASC' : 'DESC';
    }
    else {
      this.sortColumn = event.sortField
      this.sortOrder = event.sortOrder != 1 ? 'DESC' : 'ASC';
    }

    this.getGeneralCommentsList();

  }
  selectChangePageSize(event: any) {
    this.pageNumber = 1;
    this.pageSize = parseInt(event.target.value);
    this.getGeneralCommentsList();
  }

  searchGeneralComments(event: any) {
    this.pageNumber = 1;
    this.searchText = event.target.value;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => { this.getGeneralCommentsList(); }, this.doneTypingInterval);
  }

  reloadData() {
    this.searchText = '';
    this.getGeneralCommentsList();
  }

}
