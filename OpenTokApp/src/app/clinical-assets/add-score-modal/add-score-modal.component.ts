import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicianSummaryService } from '../../provider/services/clinician-summary.service';
import { UsersRoleService } from '../../users-and-roles/services/users-role.service';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { DataSharingService } from '../services/datasharing.service';

@Component({
  selector: 'app-add-score-modal',
  templateUrl: './add-score-modal.component.html',
  styleUrls: ['./add-score-modal.component.scss']
})
export class AddScoreModalComponent implements OnInit {

  addScoreForm: FormGroup;
  sampleData: any[];
  filteredIcdCodes: any = [];
  masterIcdCodes: any = [];
  masterIcdCodesDesc: any = [];
  isScoreValidate: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public messageService: MessageService,
    private clinicianSummaryService: ClinicianSummaryService,
    private dataSharingService: DataSharingService

  ) {
    this.sampleData = [
      { name: 'Yes', id: 1 },
      { name: 'No', id: 2 }
    ];
  }

  ngOnInit(): void {
    this.createForm();
  }
  getIcdcodes(event: any) {

    let filtered: any[] = [];
    let query = event.query;
    if (event.query.length > 3) {
      for (let i = 0; i < this.masterIcdCodes.length; i++) {
        let icdCode = this.masterIcdCodes[i];
        if (icdCode.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(icdCode);
        }
      }
      for (let i = 0; i < this.masterIcdCodesDesc.length; i++) {
        let icdDesc = this.masterIcdCodesDesc[i];
        if (icdDesc.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(icdDesc);
        }
      }
    }
  }

  filteredCode: any
  getIcdcode(event: any) {
    if (event.query.length > 2) {
      setTimeout(() => {
        var response = event.query.substring(event.query.indexOf("-") + 1);
        this.clinicianSummaryService
          .GeticdCode(response)
          .subscribe(
            (result: any) => {
              if (result && result.body)
                this.filteredIcdCodes = result.body.map(_ => _.name);
              this.filteredCode = result.body;

            });
      }, 500);
    }
  }

  createForm() {
    this.addScoreForm = this.fb.group({
      score_min: ['', Validators.required],
      score_max: ['', Validators.required],
      code: ['', ''],
      saved_score_id: [0, ''],
      systemgenerated_score_id: [0, ''],
      description: ['', Validators.required],


    });
    if (this.config.data.question != 0) {
      this.addScoreForm.get('score_min').setValue(this.config.data.question.score_min);
      this.addScoreForm.get('score_max').setValue(this.config.data.question.score_max);
      this.addScoreForm.get('code').setValue(this.config.data.question.code);
      this.addScoreForm.get('description').setValue(this.config.data.question.description);

      this.addScoreForm.get('saved_score_id').setValue(this.config.data.question.saved_score_id);
      this.addScoreForm.get('systemgenerated_score_id').setValue(this.config.data.question.systemgenerated_score_id);
    }
    else {
      this.addScoreForm.get('saved_score_id').setValue(0);
      this.addScoreForm.get('systemgenerated_score_id').setValue(0);
    }
  }
  onSubmit(value) {
    const firstPart = value.description.split('-')[0]
    if (this.filteredCode != undefined) {
      var item = this.filteredCode.filter((x) => x.icdCode === firstPart)
      value.code = item[0].icdCode
    }
    this.loading = true;

    if (+value.score_min >= +value.score_max) {
      this.isScoreValidate = true;
      this.loading = false;
      return;
    }
    else {
      this.isScoreValidate = false;
      this.loading = false;
    }

    if (this.addScoreForm.invalid) {
      this.loading = false;
      return;
    }
    this.dataSharingService.isUnsaved.next(true);
    this.loading = false;
    this.ref.close({ data: value });
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
