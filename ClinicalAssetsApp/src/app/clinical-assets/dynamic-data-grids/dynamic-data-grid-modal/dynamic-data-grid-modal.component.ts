import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../services/clinical-asset.service';

@Component({
  selector: 'dynamic-data-grid-modal',
  templateUrl: './dynamic-data-grid-modal.component.html',
  styleUrls: ['./dynamic-data-grid-modal.component.scss']
})
export class DynamicDataGridModalComponent implements OnInit {
  statusList: any[];
  typeList: any[];
  id=0;
  selecteddata:any;
  createGridForm:any;
  loading: boolean = false;  
  gridTypeId:any;
  masterRoles:any;
  selectedRole: any = [];
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder, 
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) {
      if(config.data.gridData == null)
      {
        this.id = 0;
      }
     else{
      this.id = config.data.gridData.id;
      this.selecteddata = config.data.gridData;
     }
     this.masterRoles = config.data.roles;
     this.typeList = config.data.gridTypesData;
      this.statusList = [
        { id: true, name: 'Active' },
        { id: false, name: 'Disabled' },
      ];
     }

  ngOnInit(): void {
    if(this.selecteddata != undefined && this.selecteddata != null){
      this.selectedRole = this.selecteddata.rolename;
      if (this.selecteddata.role_id) {
        var arr = this.masterRoles.filter(item => this.selecteddata.role_id.indexOf(item.id) !== -1);
        if (arr.length > 0)
          this.selectedRole = arr;
      }
    }
    if(this.id == 0)
    {
      this.createGridForm = this._fb.group({
        id:[this.id],
        gridType: [1,[Validators.required]],
        name: ['', [Validators.required]],
        description: ['',''],
        status:[true,[Validators.required]],
        chkshowHealthProfile: [false],
        roles: ['', ''],
        sortorder : [null]
      });
    }
    else{      
      this.createGridForm = this._fb.group({
        id:[this.id],
        gridType: [this.selecteddata.type_id,[Validators.required]],
        name: [this.selecteddata.name, [Validators.required]],
        description: [this.selecteddata.description],
        status:[this.selecteddata.status,[Validators.required]],
        chkshowHealthProfile: [this.selecteddata.show_health_profile],
        roles: ['', ''],
        sortorder : [this.selecteddata.sort] 
      });

      if (this.selecteddata.role_id) {
        this.createGridForm.get('roles').setValue(this.selectedRole);
      }
    }
  }

  onSubmit(formData: any) {
    if (!this.createGridForm.valid) return;
    this.loading = true;

    const obj = {
      id:formData.id,
      name:formData.name.trim(),
      description:formData.description.trim(),
      status:formData.status, 
      show_health_profile:formData.chkshowHealthProfile,
      type:formData.gridType,
      roles:this.selectedRole,
      sortorder : formData.sortorder
    }
    
    this.clinicalAssetService.AddUpdateDynamicDataGrid(obj).subscribe(
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
