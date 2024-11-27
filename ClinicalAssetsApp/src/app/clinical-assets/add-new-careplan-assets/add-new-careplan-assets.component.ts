import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsersRoleService } from '../../users-and-roles/services/users-role.service';
import { ProviderScheduleService } from '../../provider/services/provider-schedule.service';

@Component({
  selector: 'app-add-new-careplan-assets',
  templateUrl: './add-new-careplan-assets.component.html',
  styleUrls: ['./add-new-careplan-assets.component.scss']
})
export class AddNewCareplanAssetsComponent implements OnInit {

  newRecordForm: FormGroup;
  masterData: any; masterData2: any;
  episodes: [];
  careplan_status: [];
  careplan_priority: [];
  selectedData: any;
  problem: [];
  code_key: string;
  loading: boolean = false;
  isVisible: boolean = true;
  diag_id: number = 0;
  sampleData = [
    { name: 'Active', status: true },
    { name: 'Disabled', status: false },
  ];

  constructor(
    private _fb: FormBuilder, private adminService: UsersRoleService, private fb: FormBuilder,
    private ref: DynamicDialogRef, private config: DynamicDialogConfig,
    public messageService: MessageService, private datePipe: DatePipe,
    private _carePlanService: ProviderScheduleService) {
    this.code_key = config.data.code_key;
    this.selectedData = config.data.pagedata;
  }

  ngOnInit(): void {
    this._carePlanService.getMasterData('diag', '').subscribe((result: any) => {

      this.masterData = result.diag.filter(a => a.disabled == false);
      this.masterData2 = result.diag.filter(a => a.disabled == true);
      this.masterData2.forEach(obj => {
        this.masterData.push(obj);
      })

    }, error => {
    });
    if (this.code_key == "diagnosis" || this.code_key == "barrier" || this.code_key == 'identified member risk' || this.code_key == 'general comment') {
      this.isVisible = false;
    }

    this.createForm(this.selectedData);

  }

  createForm(data) {

    if (this.selectedData != null) {
      this.newRecordForm = this._fb.group({
        id: [data.id],
        diag_id: [data.diag_id, Validators.required],
        name: [data.name, Validators.required],
        description: [data.description],
        code_key: [this.code_key, Validators.required],
        status: [data.status, Validators.required],
        user_created: [data.user_created],
        sort_order: [data.sort_order],
        description_spa: [data.description_spa],
        description_chi: [data.description_chi],
        description_kor: [data.description_kor],
        description_vie: [data.description_vie],

      })
    }
    else {
      this.newRecordForm = this._fb.group({
        id: [0],
        diag_id: [this.code_key == "diagnosis" || this.code_key == "barrier" || this.code_key == 'identified member risk' || this.code_key == 'general comment' ? 0 : '', Validators.required],
        name: ['', Validators.required],
        description: [null],
        code_key: [this.code_key, Validators.required],
        user_created: [false],
        status: [true, Validators.required],
        sort_order: [null],
        description_spa: [null],
        description_chi: [null],
        description_kor: [null],
        description_vie: [null],

      })
    }

  }

  onSubmit(value) {
    if (this.newRecordForm.invalid) {
      this.loading = false;
      return;
    }
    if (value.sort_order == 0) {
      this.messageService.add({
        severity: 'error',
        summary: "Sort Order Can't be Zero",
      });
      return;
    }

    this._carePlanService.createNewMasterCarePlanData(value).subscribe((result: any) => {
      this.loading = false;
      if (result.status == 200) {
        this.ref.close({ data: result });
      } else if (result.status == 403) {
        this.messageService.add({
          severity: 'info',
          summary: result.message,
        });
      }
      else if (result.status == 500) {
        this.messageService.add({
          severity: 'error',
          summary: result.message,
        });
      }
    },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error occurred while processing data',
        });
      })
  }
}
