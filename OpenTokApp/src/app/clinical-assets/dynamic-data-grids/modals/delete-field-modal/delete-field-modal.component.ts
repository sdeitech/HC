import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../../services/clinical-asset.service';

@Component({
  selector: 'app-delete-field-modal',
  templateUrl: './delete-field-modal.component.html',
  styleUrls: ['./delete-field-modal.component.scss']
})
export class DeleteFieldModalComponent implements OnInit {
isConfirmDelete = false;
fieldData:any;
confirmationText = '';
loading: boolean = false;
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) {
    if(config.data.fieldData != null){
      this.fieldData = config.data.fieldData;
      if(this.fieldData.field_response != null && this.fieldData.field_response.length > 0){
        let activeResponse = this.fieldData.field_response.filter(x=>x.status);
        if(activeResponse.length > 0)
          this.isConfirmDelete = true;
      }      
      if(this.fieldData.field_suspects != null || this.fieldData.field_cpt != null)
        this.isConfirmDelete = true;
    }
   }

  ngOnInit(): void {    
  }


  enableDelete() : boolean{
    return (this.isConfirmDelete == false || this.confirmationText.toLowerCase() == 'permanently delete');
  }

  deleteField(){
    this.clinicalAssetService.deleteDgFieldData(this.fieldData.id).subscribe(
      (res: any) => {        
        this.loading = false;
        if (res.status == 403) {
          this._messageService.add({
            severity: 'info',
            summary: res.message,
            detail: '',
          });
        }
        else if (res.status == 500) {
          this._messageService.add({
            severity: 'error',
            summary: res.message,
            detail: '',
          });
        }
        else {
          this.ref.close({ data: res });
        }

      }, (error) => {
        this.loading = false;
      })
  }
}
