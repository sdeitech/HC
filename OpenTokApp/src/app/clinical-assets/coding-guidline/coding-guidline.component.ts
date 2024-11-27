import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { NewTemplateModalComponent } from './new-template-modal/new-template-modal.component';
interface SampleData {
  name: string
}

interface SampleMultiSelectData {
  name: string
}

@Component({
  selector: 'coding-guidline',
  templateUrl: './coding-guidline.component.html',
  styleUrls: ['./coding-guidline.component.scss']
})
export class CodingGuidlineComponent implements OnInit {
  loaderStatus:boolean=true;
  guidlineData: any;
  ref: DynamicDialogRef;
  constructor( public dialogService: DialogService,
    public messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) { 
 
  }

  ngOnInit(): void {
    this.getAllGuidelines();
  }
  
  getAllGuidelines() {
    this.clinicalAssetService.getGuidlinesData().subscribe(
      (result: any) => {
        this.loaderStatus=false;
        this.guidlineData = result.body;
      },
      (error) => { }
    );
  }
  newTemplateModal(data) {   
  let id=0;
  if (data != null)
  {
    id=data.id;
  }

    this.ref = this.dialogService.open(NewTemplateModalComponent, {
      header: id == 0 ? 'Create Template' : 'Update Template',
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { codingData:data},
    });

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getAllGuidelines();
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Error while saving data',
          });
          this.getAllGuidelines();
        }
      } 
    
      else{
        this.getAllGuidelines();
      }
    });
  }
}
