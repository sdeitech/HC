import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddNewCareplanAssetsComponent } from '../add-new-careplan-assets/add-new-careplan-assets.component';
import { ClinicalAssetService } from '../services/clinical-asset.service';


@Component({
  selector: 'app-careplan-diagnosis',
  templateUrl: './careplan-diagnosis.component.html',
  styleUrls: ['./careplan-diagnosis.component.scss']
})
export class CareplanDiagnosisComponent implements OnInit {
  @Input() masterData: any;
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
  diagnosisList: any = [];
  patientData: any;
  typingTimer;
  doneTypingInterval = 1000;
  loaderStatus:boolean=true;

  constructor(
    private _carePlanService: ClinicalAssetService,
    private ref: DynamicDialogRef,
    public messageService: MessageService, public dialogService: DialogService,
  ) {

  }

  ngOnInit(): void {
    this.pageNumber = 1;
    this.pageSize = 5;
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.getDiagnosisList();
  }

  addDiagnosis(data: any) {
    var isUpdate = false;
    if (data != null) {
      isUpdate = true;
      data.user_created = false;
      data.id = data.diag_id;
    }

    this.ref = this.dialogService.open(AddNewCareplanAssetsComponent, {
      header: isUpdate ? 'Update Diagnosis' : 'Add Diagnosis',
      width: '700px',
      contentStyle: { "max-height": "90vh" },
      data: { pagedata: data, isUpdate: isUpdate, code_key: 'diagnosis' },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: result.data.message,
          });
          this.getDiagnosisList();
        }
        else {
          this.messageService.add({
            severity: 'info',
            summary: result.data.message,
          });
          this.getDiagnosisList();
        }
      }
    });
  }

  getDiagnosisList() {
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
      .getCarePlanDiagnosisData(model)
      .subscribe((response: any) => {
        this.loading = false;
        this.loaderStatus=false;
        this.diagnosisList = [];
        this.totalRecords = 0;
        if (response.body.length > 0) {
          this.diagnosisList = response.body
          this.totalRecords = this.diagnosisList[0].totalrecords;
        }
      })
  }

  loadLazy(event) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.sortColumn = 'sort_order';
    this.sortOrder = event.sortOrder == 1 ? 'ASC' : 'DESC';
    this.getDiagnosisList();

  }

  selectChangePageSize(event: any) {
    this.pageNumber = 1;
    this.pageSize = parseInt(event.target.value);
    this.getDiagnosisList();
  }

  searchDiagnosis(event: any) {
    this.pageNumber = 1;
    this.searchText = event.target.value;
    // this.getDiagnosisList();
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => { this.getDiagnosisList() }, this.doneTypingInterval);

  }

  reloadData() {
    this.searchText = '';
    this.getDiagnosisList();
  }


}
