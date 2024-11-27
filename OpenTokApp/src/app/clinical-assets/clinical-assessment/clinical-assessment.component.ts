import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../services/clinical-asset.service';

@Component({
  selector: 'clinical-assessment',
  templateUrl: './clinical-assessment.component.html',
  styleUrls: ['./clinical-assessment.component.scss']
})
export class ClinicalAssessmentComponent implements OnInit {
  ref: DynamicDialogRef;
  assessmentList: any[];
  editAssessment: any = {};
  loaderStatus:boolean=true;
  constructor(
    public dialogService: DialogService,
    private clinicalAssetService: ClinicalAssetService,
    public messageService: MessageService,
    private _router: Router,

  ) { }

  ngOnInit(): void {
    this.getAssessments();
  }

  newAssessment(value) {
    if (value == 0)
      this.editAssessment = {};
    this._router.navigate(["/admin-clinical/new-assessment"], { queryParams: { assessment_id: btoa('0') } });
  }

  getAssessments() {
    this.clinicalAssetService.getAssessmentDatagrid().subscribe(
      (result: any) => {
        this.loaderStatus=false;
        this.assessmentList = result.body.assessment;
      },
      (error) => { }
    );
  }

  updateAssessment(assessment) {
    this.editAssessment = assessment;
    this._router.navigate(["/admin-clinical/new-assessment"], { queryParams: { assessment_id: btoa(assessment.id) } });
  }
}
