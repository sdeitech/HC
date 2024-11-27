import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { DynamicDataGridModalComponent } from './dynamic-data-grid-modal/dynamic-data-grid-modal.component';

@Component({
  selector: 'dynamic-data-grids',
  templateUrl: './dynamic-data-grids.component.html',
  styleUrls: ['./dynamic-data-grids.component.scss']
})
export class DynamicDataGridsComponent implements OnInit {
  dynamicDataGridData: any;
  ref: DynamicDialogRef;
  dynamicDatagridTypes:any;
  dgFieldTypes:any;
  id=0;
  masterData:any;
  loaderStatus:boolean=true;
  constructor(private clinicalAssetService: ClinicalAssetService,public dialogService: DialogService
    ,public messageService: MessageService,private _router: Router) { }

  ngOnInit(): void {
    this.getAllDataGrids();
    this.geAllDynamicgridTypes();
    this.getMasterData();
  }

  getAllDataGrids() {
    this.clinicalAssetService.getDynamicDataGridData().subscribe(
      (result: any) => {
        this.loaderStatus=false;
        this.dynamicDataGridData = result.body;        
      },
      (error) => { }
    );
  }

  geAllDynamicgridTypes() {
    this.clinicalAssetService.getAllDynamicgridMasterData().subscribe(
      (result: any) => {
        this.dynamicDatagridTypes = result.body.dynamicGridTypes; 
        this.dgFieldTypes = result.body.dgFieldTypes;       
      },
      (error) => { }
    );
  }

  newDynamicGridModal(data) {    
  if (data != null)
  {
    this.id=data.id;
  }

    this.ref = this.dialogService.open(DynamicDataGridModalComponent, {
      header: this.id == 0 ? 'Create New Dynamic Datagrid' : 'Update Dynamic Datagrid',
      width: '600px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { gridData:data,gridTypesData:this.dynamicDatagridTypes,roles:this.masterData.role},
    });

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getAllDataGrids();
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Error while saving data',
          });
          this.getAllDataGrids();
        }
      }     
      else{
        this.getAllDataGrids();
      }
    });
  }

  viewDataGrid(item) {
    this._router.navigate(["/admin-clinical/view-datagrid"], { queryParams: { grid_id: btoa(item.id) }});
  }

  getMasterData() {
    this.clinicalAssetService.getMasterDataOrderbyKey('role', '','code','asc').subscribe(
      (result: any) => {
        this.masterData = result;
      },
      (error) => { }
    );
  }
}
