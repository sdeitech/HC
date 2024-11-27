import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddNewCareplanAssetsComponent } from '../add-new-careplan-assets/add-new-careplan-assets.component';
import { ClinicalAssetService } from '../services/clinical-asset.service';

@Component({
  selector: 'app-careplan-identified-member-risks',
  templateUrl: './careplan-identified-member-risks.component.html',
  styleUrls: ['./careplan-identified-member-risks.component.scss']
})
export class CareplanIdentifiedMemberRisksComponent implements OnInit {
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
  identifiedMemberRisksList: any = [];
  patientData: any;
  typingTimer;
  doneTypingInterval = 1000;
  loaderStatus: boolean = true;
  constructor(private _carePlanService: ClinicalAssetService,
    private ref: DynamicDialogRef,
    public messageService: MessageService, public dialogService: DialogService,) { }

  ngOnInit(): void {
    this.pageNumber = 1;
    this.pageSize = 5;
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;

    this.sortColumn = 'name';
    this.sortOrder = 'ASC';


    this.getIdentifiedMemberRisksList();
  }

  addIdentifiedMemberRisk(data: any) {
    var isUpdate = false;
    if (data != null) {
      isUpdate = true;
      data.name = data.description;
      data.id = data.risk_id;
      data.diag_id = 0;
    }

    this.ref = this.dialogService.open(AddNewCareplanAssetsComponent, {
      header: isUpdate ? 'Update Identified Member Risk' : 'Add Identified Member Risk',
      width: '700px',
      contentStyle: { "max-height": "90vh" },
      data: { pagedata: data, isUpdate: isUpdate, code_key: 'identified member risk' },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: result.data.message,
          });
          this.getIdentifiedMemberRisksList();
        }
        else {
          this.messageService.add({
            severity: 'info',
            summary: result.data.message,
          });
          this.getIdentifiedMemberRisksList();
        }
      }
    });
  }

  getIdentifiedMemberRisksList() {
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
      .getCarePlanIdentifiedMemberRisksData(model)
      .subscribe((response: any) => {
        this.loading = false;
        this.loaderStatus = false;
        this.identifiedMemberRisksList = [];
        this.totalRecords = 0;
        if (response.body.length > 0) {
          this.identifiedMemberRisksList = response.body
          this.totalRecords = this.identifiedMemberRisksList[0].totalrecords;
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

    this.getIdentifiedMemberRisksList();

  }

  selectChangePageSize(event: any) {
    this.pageNumber = 1;
    this.pageSize = parseInt(event.target.value);
    this.getIdentifiedMemberRisksList();
  }

  searchidenifiedmemberrisk(event: any) {
    this.pageNumber = 1;
    this.searchText = event.target.value;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => { this.getIdentifiedMemberRisksList(); }, this.doneTypingInterval);
  }

  reloadData() {
    this.searchText = '';
    this.getIdentifiedMemberRisksList();
  }

}
