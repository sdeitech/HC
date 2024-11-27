import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { DataGridModalComponent } from './data-grids-modal/data-grids-modal.component';
interface SampleData {
  name: string
}

interface SampleMultiSelectData {
  name: string
}

@Component({
  selector: 'data-grid',
  templateUrl: './data-grids.component.html',
  styleUrls: ['./data-grids.component.scss']
})
export class DataGridComponent implements OnInit {

  dataGridData: any;
  ref: DynamicDialogRef;
  masterData:any;
  loaderStatus:boolean=true;
  constructor( public dialogService: DialogService,
    public messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) { 
 
  }

  ngOnInit(): void {
    this.getMasterData() ;
    this.getAllDataGrids();
  }

  getMasterData() {
    this.clinicalAssetService.getMasterDataOrderbyKey('role', '','code','asc').subscribe(
      (result: any) => {
        this.masterData = result;
      },
      (error) => { }
    );
  }
  
  getAllDataGrids() {
    this.clinicalAssetService.getDatGridData().subscribe(
      (result: any) => {
        this.loaderStatus=false;
        this.dataGridData = result.body;
      },
      (error) => { }
    );
  }
  newTemplateModal(data) {   
     this.ref = this.dialogService.open(DataGridModalComponent, {
      header:  'Update DataGrid',
      width: '500px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: {datagridData:data,masterData:this.masterData},
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
}
