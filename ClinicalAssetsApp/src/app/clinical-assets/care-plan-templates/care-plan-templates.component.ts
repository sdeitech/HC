import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { CarePlanTemplatesModalComponent } from './care-plan-templates-modal/care-plan-templates-modal.component';


@Component({
  selector: 'app-care-plan-templates',
  templateUrl: './care-plan-templates.component.html',
  styleUrls: ['./care-plan-templates.component.scss']
})
export class CarePlanTemplatesComponent implements OnInit {
  id = 0;
  ref: DynamicDialogRef;
  careplanTemplateList: any;
  loaderStatus:boolean=true;
  constructor(
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private messageService: MessageService,
    public dialogService: DialogService,
    private clinicalAssetService: ClinicalAssetService,
    private _router: Router) {

  }

  ngOnInit(): void {
    this.getallCarePlanTempalate();
  }
  careplaneTemplates = [{ 'id': 1, name: 'New Care Plan Templates' },
  { 'id': 2, name: 'New Care Plan Templates' },
  { 'id': 3, name: 'New Care Plan Templates' }
  ];

  newCarePlanTemplateModal(data) {
    this.id = 0;
    if (data != null) {
      this.id = data.id;
    }

    this.ref = this.dialogService.open(CarePlanTemplatesModalComponent, {
      header: this.id == 0 ? 'Create Care plane template' : 'Update Care plane template',
      width: '600px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { templateData: data },
    });

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getallCarePlanTempalate();
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Error while saving data',
          });
          this.getallCarePlanTempalate();
        }
      }
      else {
        this.getallCarePlanTempalate();
      }
    });
  }
  UpdateCarePlanTemplateModal(data) {
    this._router.navigate(["/admin-clinical/care-plan-template-details"], {
      queryParams: {
        id: (data.id),
        name: (data.name),
        status: data.status
      }
    });
  }
  getallCarePlanTempalate() {
    this.clinicalAssetService.getCarePlanTemplatesList().subscribe(
      (result: any) => {
        this.loaderStatus=false;
        this.careplanTemplateList = result.body.carePlanTemplates.filter(x => x.status == true);
      },
      (error) => { }
    );
  }

}
