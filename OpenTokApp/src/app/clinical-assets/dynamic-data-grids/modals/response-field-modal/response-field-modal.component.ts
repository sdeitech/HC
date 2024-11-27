import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../../services/clinical-asset.service';

@Component({
  selector: 'app-response-field-modal',
  templateUrl: './response-field-modal.component.html',
  styleUrls: ['./response-field-modal.component.scss']
})
export class ResponseFieldModalComponent implements OnInit {
  fieldId:number;
  loading = false;
  submit = false;
  fieldResponse: any[] = [];
  fieldType = 0;
  statusList: any[];
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,    
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) {
      if(config.data.fieldData != null){                
        this.fieldId = config.data.fieldData.id;
        this.fieldType = config.data.fieldData.field_type_id;
        this.fieldResponse = config.data.fieldData.field_response != null ? config.data.fieldData.field_response : [];
      }
      this.statusList = [
        { id: true, name: 'Active' },
        { id: false, name: 'Disabled' },
      ];
    }

  ngOnInit(): void {
  }
  dropdaragResponse(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldResponse, event.previousIndex, event.currentIndex);

    this.fieldResponse
      .forEach((x, idx) => {
        x.response_sort_order = idx + 1;
      });
  }

  addResponse(){
    const obj = {
      id:0,
      name:"",        
      field_id:this.fieldId,    
      ideal_choice:false,
      response_sort_order: this.fieldResponse.length + 1,
      isNotValid:false,
      status:true
    }
    this.fieldResponse.push(obj);
  }

  saveResponse(){
    if(!this.validateFieldResponse()) return; 
    const obj={
      dgFieldResponses : this.fieldResponse
    };
    
    this.clinicalAssetService.AddUpdateFieldResponseData(obj).subscribe(
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

  validateFieldResponse():boolean{
    let valid = true;
    this.fieldResponse.forEach(i=>{
      if(i.name == '' || i.name == null){
        i.isNotValid = true;
        valid = false;
      }
    });
    return valid;
  }

  checkForSingleField(data){
    if(this.fieldType == 3){
      this.fieldResponse.forEach(i=>{
        if(i.ideal_choice != null && i.ideal_choice && i != data)
            i.ideal_choice = false;
      });
    }
  }
}