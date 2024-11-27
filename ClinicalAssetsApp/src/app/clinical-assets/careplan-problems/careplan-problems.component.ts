import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { MessageService } from 'primeng/api';
import { AddNewCareplanAssetsComponent } from '../add-new-careplan-assets/add-new-careplan-assets.component';


@Component({
  selector: 'app-careplan-problems',
  templateUrl: './careplan-problems.component.html',
  styleUrls: ['./careplan-problems.component.scss']
})
export class CareplanProblemsComponent implements OnInit {
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
  problemsList: any = [];
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

    this.sortColumn = 'name';
    this.sortOrder = 'ASC';


    this.getProblemsList();
  }

  addProblem(data: any) {
    var isUpdate = false;
    if (data != null) {
      isUpdate = true;
      data.name = data.description;
      data.id = data.problem_id;
      data.description_chi = data.description_chi;
      data.description_kor = data.description_kor;
      data.description_spa = data.description_spa;
      data.description_vie = data.description_vie;
    }

    this.ref = this.dialogService.open(AddNewCareplanAssetsComponent, {
      header: isUpdate ? 'Update Problem' : 'Add Problem',
      width: '700px',
      contentStyle: { "max-height": "90vh" },
      data: { pagedata: data, isUpdate: isUpdate, code_key: 'problem' },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: result.data.message,
          });
          this.getProblemsList();
        }
        else {
          this.messageService.add({
            severity: 'info',
            summary: result.data.message,
          });
          this.getProblemsList();
        }
      }
    });
  }
  getProblemsList() {
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
      .getCarePlanProblemsData(model)
      .subscribe((response: any) => {
        this.loading = false;
        this.loaderStatus=false;
        this.problemsList = [];
        this.totalRecords = 0;
        if (response.body.length > 0) {
          this.problemsList = response.body
          this.totalRecords = this.problemsList[0].totalrecords;
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

    this.getProblemsList();

  }

  selectChangePageSize(event: any) {
    this.pageNumber = 1;
    this.pageSize = parseInt(event.target.value);
    this.getProblemsList();
  }


  searchProblems(event: any) {
    this.pageNumber = 1;
    this.searchText = event.target.value;
    // this.getDiagnosisList();
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => { this.getProblemsList(); }, this.doneTypingInterval);

  }

  reloadData() {
    this.searchText = '';
    this.getProblemsList();
  }


}
