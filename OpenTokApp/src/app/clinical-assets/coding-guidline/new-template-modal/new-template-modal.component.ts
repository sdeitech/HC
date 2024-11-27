import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../services/clinical-asset.service';
interface SampleData {
  name: string,
  status:boolean
}

@Component({
  selector: 'app-new-template-modal',
  templateUrl: './new-template-modal.component.html',
  styleUrls: ['./new-template-modal.component.scss']
})
export class NewTemplateModalComponent implements OnInit {

  sampleData: SampleData[];
  id=0;
  seleceddata:any;
  addGuidlineForm:any;
  loading: boolean = false;

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder, 
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) { 
      if(config.data.codingData == null)
      {
        this.id = 0;
      }
     else{
      this.id = config.data.codingData.id;
      this.seleceddata = config.data.codingData;
     }
    this.sampleData = [
      { name: 'Active',status:true},
      { name: 'Disabled',status:false},
    ];
  }

  ngOnInit(): void {
    if(this.id == 0)
    {
      this.addGuidlineForm = this._fb.group({
        id:[this.id],
        name: ['', [Validators.required]],
        status:[true,[Validators.required]],
        template: [''],
      
      });
    }
    else{      
      this.addGuidlineForm = this._fb.group({
        id:[this.id],
        name: [this.seleceddata.name, [Validators.required]],
        status:[this.seleceddata.status],   
        template: [this.seleceddata.template],
      });
    }
  }

  onSubmit(claimData: any) {
    if (!this.addGuidlineForm.valid) return;
    this.loading = true;

    const obj = {
      id:claimData.id,
      name:claimData.name.trim(),
      status:claimData.status, 
      template:claimData.template
    }

    this.clinicalAssetService.createNewTemplate(obj).subscribe(
      (res: any) => {
        this.loading = false;
        if(res.status== 403)
        {
          this._messageService.add({
            severity: 'info',
            summary: res.message,
            detail: '',
          });
        }
        else if(res.status== 500)
        {
          this._messageService.add({
            severity: 'error',
            summary: res.message,
            detail: '',
          });
        }
        else{
          this.ref.close({ data: res  });
        }
  
  })
  }

  closeDialog() {
    this.ref.close();
  }

}
