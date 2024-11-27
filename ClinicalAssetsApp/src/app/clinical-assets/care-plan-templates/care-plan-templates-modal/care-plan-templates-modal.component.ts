import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../services/clinical-asset.service';

@Component({
  selector: 'app-care-plan-templates-modal',
  templateUrl: './care-plan-templates-modal.component.html',
  styleUrls: ['./care-plan-templates-modal.component.scss']
})
export class CarePlanTemplatesModalComponent implements OnInit {
  loading: boolean = false;  
  id=0;
  seleceddata:any;
  createGridForm:any;
  statusList: {}[];
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder, 
    private _messageService: MessageService,private clinicalAssetService: ClinicalAssetService) {
      
      if(config.data.templateData == null)
      {
        this.id = 0;
      }
     else{
      this.id = config.data.templateData.id;
      this.seleceddata = config.data.templateData;
     }

      this.statusList = [{id : true , name : 'Active'}, {id: false, name :'Disabled'}]
      
     }

  ngOnInit(): void {
    if(this.id == 0)
    {
      this.createGridForm = this._fb.group({
        id:[this.id],
        name: ['', [Validators.required]],
        status:[true,[Validators.required]],
        
      });
    }

    else{      
      this.createGridForm = this._fb.group({
        id:[this.id],
        name: [this.seleceddata.name, [Validators.required]],
        status:[this.seleceddata.status,[Validators.required]],
        
      });
    }
  }

  onSubmit(formData: any) {
    if (!this.createGridForm.valid) return;
    this.loading = true;

    const obj = {
      id:formData.id,
      name:formData.name.trim(),
      active:formData.status,
    }

    this.clinicalAssetService.addUpdateCarePlanTemplate(obj).subscribe(
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
