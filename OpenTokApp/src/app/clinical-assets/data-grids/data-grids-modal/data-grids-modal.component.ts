import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../services/clinical-asset.service';
interface SampleData {
  name: string,
  status: boolean
}

@Component({
  selector: 'app-data-grid-modal',
  templateUrl: './data-grids-modal.component.html',
  styleUrls: ['./data-grids-modal.component.scss']
})
export class DataGridModalComponent implements OnInit {

  sampleData: SampleData[];
  id = 0;
  seleceddata: any;
  addGuidlineForm: any;
  loading: boolean = false;
  masterRoles: any=[]; masterRoles2: any=[];
  selectedRole: any = [];

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) {

    if (config.data.datagridData == null) {
      this.id = 0;
    }
    else {
      this.id = config.data.datagridData.id;
      this.seleceddata = config.data.datagridData;
    }
    
    this.masterRoles = config.data.masterData.role.filter(a => a.disabled == false);
    this.masterRoles2 = config.data.masterData.role.filter(a => a.disabled == true);
    this.masterRoles2.forEach(obj => {
      this.masterRoles.push(obj);
    })

    this.sampleData = [
      { name: 'Active', status: true },
      { name: 'Disabled', status: false },
    ];
  }

  ngOnInit(): void {
    this.selectedRole = this.seleceddata.rolename;
    if (this.seleceddata.role_id) {
      var arr = this.masterRoles.filter(item => this.seleceddata.role_id.indexOf(item.id) !== -1);
      if (arr.length > 0)
        this.selectedRole = arr;
    }
    this.addGuidlineForm = this._fb.group({
      id: [this.id],
      name: [this.seleceddata.name],
      status: [this.seleceddata.status],
      sortOrder: [this.seleceddata.sort_order],
      template: [this.seleceddata.angular_template],
      roles: ['', '']
    });

    if (this.seleceddata.role_id) {
      this.addGuidlineForm.get('roles').setValue(this.selectedRole);
    }
  }

  onSubmit(dataGridData: any) {
    this.loading = true;

    this.clinicalAssetService.updateDataGrid(dataGridData).subscribe(
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

  closeDialog() {
    this.ref.close();
  }

}
