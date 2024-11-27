import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddNewCareplanAssetsComponent } from '../add-new-careplan-assets/add-new-careplan-assets.component';
import { ClinicalAssetService } from '../services/clinical-asset.service';


@Component({
  selector: 'app-careplan-interventions',
  templateUrl: './careplan-interventions.component.html',
  styleUrls: ['./careplan-interventions.component.scss']
})
export class CareplanInterventionsComponent implements OnInit {
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
  interventionsList: any = [];
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

    this.sortColumn = 'diag_name';
    this.sortOrder = 'ASC';


    this.getInterventionsList();
  }

  addIntervention(data: any) {
    var isUpdate = false;
    if (data != null) {
      isUpdate = true;
      data.name = data.description;
      data.id = data.intervention_id;
    }

    this.ref = this.dialogService.open(AddNewCareplanAssetsComponent, {
      header: isUpdate ? 'Update Intervention' : 'Add Intervention',
      width: '700px',
      contentStyle: { "max-height": "90vh" },
      data: { pagedata: data, isUpdate: isUpdate, code_key: 'intervention' },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: result.data.message,
          });
          this.getInterventionsList();
        }
        else {
          this.messageService.add({
            severity: 'info',
            summary: result.data.message,
          });
          this.getInterventionsList();
        }
      }
    });
  }
  getInterventionsList() {
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
      .getCarePlanInterventionsData(model)
      .subscribe((response: any) => {
        this.loading = false;
        this.loaderStatus=false;
        this.interventionsList = [];
        this.totalRecords = 0;
        if (response.body.length > 0) {
          this.interventionsList = response.body
          this.totalRecords = this.interventionsList[0].totalrecords;
        }
     else {
       this.totalRecords = 0;
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

    this.getInterventionsList();

  }

  selectChangePageSize(event: any) {
    this.pageNumber = 1;
    this.pageSize = parseInt(event.target.value);
    this.getInterventionsList();
  }


  searchInterventions(event: any) {
    this.pageNumber = 1;
    this.searchText = event.target.value;
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => { this.getInterventionsList(); }, this.doneTypingInterval);
  }

  reloadData() {
    this.searchText = '';
    this.getInterventionsList();
  }


}
