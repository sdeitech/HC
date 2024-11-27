import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../services/clinical-asset.service';
import { CptGenModalComponent } from '../modals/cpt-gen-modal/cpt-gen-modal.component';
import { DeleteFieldModalComponent } from '../modals/delete-field-modal/delete-field-modal.component';
import { ResponseFieldModalComponent } from '../modals/response-field-modal/response-field-modal.component';
import { SuspectFieldModalComponent } from '../modals/suspect-field-modal/suspect-field-modal.component';
import { NewFieldModalComponent } from '../new-field-modal/new-field-modal.component';

@Component({
  selector: 'view-datagrid',
  templateUrl: './view-datagrid.component.html',
  styleUrls: ['./view-datagrid.component.scss']
})
export class ViewDatagridComponent implements OnInit {
  ref: DynamicDialogRef;
  showGridDetails = false;
  dynamicDataGridData: any;
  grid_id = 0;
  id = 0;
  fieldTypes:any;
  dynamicDgFieldData:any = [];
  dgFieldCalculationData:any;
  dgLookUpDatasetList:any;
  searchText = '';
  showDgFields = false;
  tabluarPreData:any = [];
  detailPreData:any = [];
  chkHealthProfile = false;
  gridTypeId = 0;
  constructor(private _router: Router,private clinicalAssetService: ClinicalAssetService,private _route: ActivatedRoute,
    public dialogService: DialogService,public messageService: MessageService) 
  {
    this.grid_id = +atob(this._route.snapshot.queryParamMap.get('grid_id'));    
    if (this.grid_id == 0) {     
      this.back();
    }
    else {
      this.getDataGridDetails();
      this.getAllDgFieldTypes();
      this.getAllFields(0);
    }
  }

  ngOnInit(): void {

  }

  getAllDgFieldTypes() {
    this.clinicalAssetService.getAllDynamicgridMasterData().subscribe(
      (result: any) => {
        this.fieldTypes = result.body.dgFieldTypes;
        this.dgLookUpDatasetList = result.body.dgLookUpDatasets;
      },
      (error) => { }
    );
  }

  getDataGridDetails() {
    this.clinicalAssetService.getDynamicDataGridData(this.grid_id).subscribe(
      (result: any) => {
        result.body.forEach((item) => {
          if (item.id == this.grid_id) {
            this.dynamicDataGridData = item;   
            this.chkHealthProfile = item.show_health_profile;  
            this.gridTypeId = item.type_id;   
            this.showGridDetails = true;                                              
          }
        })
      },
      (error) => { console.log(error); }
    );
  }

  back() {
    this._router.navigate(['/admin-clinical'], { queryParams: { tab: 2 } });
  }

  newFieldModel(item){ 
    let calcData:any;
    if(this.dgFieldCalculationData != undefined && this.dgFieldCalculationData != null && item != null){
      this.dgFieldCalculationData.forEach(i=>{
        if(i.field_id == item.id){
          calcData = i;
        }
      });
    } 
    this.ref = this.dialogService.open(NewFieldModalComponent, {
      header: item == null ? 'Create New Field' : 'Edit Field '+ item.field_type_name,
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { gridId:this.grid_id,fieldData:item,fieldTypesData:this.fieldTypes,lookupDatasets:this.dgLookUpDatasetList,
              allDgFields:this.dynamicDgFieldData,fieldCalcData:(calcData != undefined) ? calcData : null},
    });

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getAllFields(0);
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Error while saving data',
          });
          this.getAllFields(0);
        }
      }
      else {
        this.getAllFields(0);
      }
    });
  }

  getAllFields(id){    
    this.clinicalAssetService.getDgFieldsList(id,this.grid_id).subscribe(
      (result: any) => {                        
        this.dynamicDgFieldData = result.body.fields;  
        this.dgFieldCalculationData = result.body.field_calculations;      
        this.showDgFields = true; 
      },
      (error) => { console.log(error); }
    );
  }

  enableSuspect(item): boolean {
    switch (item.field_type_id) {
      case 1: //text
      case 3: //single select
      case 4: //multi select
      case 7: //calculated
        return true;
      default:
          return false;          
    }    
  }

  filterFields(): any[] {
    let filedData = this.filterBasedOnDetail();    
    return filedData.filter(i => i.name.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
  }

  deleteField(item) {
    this.ref = this.dialogService.open(DeleteFieldModalComponent, {
      header: "Delete Field",
      width: '600px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { fieldData: item },
    });

    this.ref.onClose.subscribe((res) => {      
      if (res != undefined) {
        if (res.data.body.status == 200) {          
          this.messageService.add({
            severity: 'success',
            summary: res.data.body.message,
            detail: '',
          });
          this.getAllFields(0);
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.body.message,
            detail: 'Error while saving data',
          });
          this.getAllFields(0);
        }
      }     
      else{
        this.getAllFields(0);
      }
    });
  }

  responseModal(item){
    this.ref = this.dialogService.open(ResponseFieldModalComponent, {
      header: "Response Values",
      width: '600px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { fieldData:item },
    });

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getAllFields(0);
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Error while saving data',
          });
          this.getAllFields(0);
        }
      }
      else {
        this.getAllFields(0);
      }
    });
  }

  dropdaragVertical(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.detailPreData, event.previousIndex, event.currentIndex);

    this.detailPreData
      .forEach((x, idx) => {        
          x.detail_sort_order = idx + 1;
      });
    this.updateSortOrder(this.detailPreData);
  }

  dropdaragField(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.tabluarPreData, event.previousIndex, event.currentIndex);

      this.tabluarPreData
        .forEach((x, idx) => {          
            x.tabular_sort_order = idx + 1;
        });
        this.updateSortOrder(this.tabluarPreData);
  }

  filterTabularShowCount():boolean{
    return this.dynamicDgFieldData != null && this.dynamicDgFieldData.length > 0 ? 
    this.dynamicDgFieldData.filter(x=>x.show_in_tabular && x.status).sort(x=>x.tabular_sort_order).length > 0 : false;
  }

  filterTabularData(){
    let showTabluarRecord = this.dynamicDgFieldData.length > 0 ? this.dynamicDgFieldData.filter(x=>x.show_in_tabular && x.status): [];
    let nonShowTabluarRecord = this.dynamicDgFieldData.length > 0 ? this.dynamicDgFieldData.filter(x=>!x.show_in_tabular && x.status) : [];
    if(showTabluarRecord != null && showTabluarRecord.length > 0){
      this.tabluarPreData = showTabluarRecord;
      if(nonShowTabluarRecord != null && nonShowTabluarRecord.length > 0)
          nonShowTabluarRecord.forEach(i=>{
            this.tabluarPreData.push(i);
          });          
    }else{
      this.tabluarPreData = [];
    }
    return this.tabluarPreData;
  }

  filterBasedOnDetail(){
    let result = [];
    let showTabluarRecord = this.dynamicDgFieldData.length > 0 ? this.dynamicDgFieldData.filter(x=>x.show_in_detail && x.status): [];
    showTabluarRecord = showTabluarRecord.sort(function(a, b) {
      if (a.detail_sort_order < b.detail_sort_order)
        return -1;
      if (a.detail_sort_order > b.detail_sort_order)
        return 1;
      return 0;
    });
    let nonShowTabluarRecord = this.dynamicDgFieldData.length > 0 ? this.dynamicDgFieldData.filter(x=>!x.show_in_detail&& x.status) : [];
    if(showTabluarRecord != null && showTabluarRecord.length > 0){
      result = showTabluarRecord;
    }
    let disabledFields = this.dynamicDgFieldData.length > 0 ? this.dynamicDgFieldData.filter(x=>!x.status) : [];
    if(nonShowTabluarRecord != null && nonShowTabluarRecord.length > 0){
      nonShowTabluarRecord.forEach(i=>{
        result.push(i);
      });          
    }
    if(disabledFields != null && disabledFields.length > 0){
      disabledFields.forEach(i=>{
        result.push(i);
      });
    }  
    return result;
  }

  fillTabularPreData(){
    this.tabluarPreData = this.filterTabularData();
    this.tabluarPreData =  this.tabluarPreData.length > 0 ? this.tabluarPreData.filter(x=>x.show_in_tabular && x.status).sort(function(a, b) {
      if (a.tabular_sort_order < b.tabular_sort_order)
        return -1;
      if (a.tabular_sort_order > b.tabular_sort_order)
        return 1;
      return 0;
    }) : this.tabluarPreData;
    return this.tabluarPreData;
  }

  fillDetailPreData(){
    let showDetailRecord = this.dynamicDgFieldData.filter(x=>x.show_in_detail && x.status);
    let nonShowDetailRecord = this.dynamicDgFieldData.filter(x=>!x.show_in_detail && x.status);
    if(showDetailRecord != null && showDetailRecord.length > 0){
      this.detailPreData = showDetailRecord;
      if(nonShowDetailRecord != null && nonShowDetailRecord.length > 0)
          nonShowDetailRecord.forEach(i=>{
            this.detailPreData.push(i);
          });          
    }else{
      this.detailPreData = [];
    }
    this.detailPreData = this.detailPreData.length > 0 ? this.detailPreData.filter(x=>x.show_in_detail && x.status).sort(function(a, b) {
      if (a.detail_sort_order < b.detail_sort_order)
        return -1;
      if (a.detail_sort_order > b.detail_sort_order)
        return 1;
      return 0;
    }) : this.detailPreData;   
    return this.detailPreData; 
  }

  updateSortOrder(data){
    let fieldList = {
      dgFields:data!= undefined && data != null ? data : []
    };

    this.clinicalAssetService.UpdateFieldOrderData(fieldList).subscribe(
      (result: any) => {                
        if(result.status == 200){
          this.getDataGridDetails();
        }
      },
      (error) => { }
    );
  }

  suspectModal(item){ 
    let header = '';
    switch(item.field_type_id){
      case 1:      
        header = 'Text Input Suspects'
        break;
      case 3:
      case 4:
        header = 'Select Suspects';
        break;
      case 7:
        header = 'Calculate Input Suspects';
        break;
      default:
          header = '';
    }
    this.ref = this.dialogService.open(SuspectFieldModalComponent, {
      header: header,
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { fieldData:item},
    });    

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getAllFields(0);
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Error while saving data',
          });
          this.getAllFields(0);
        }
      }
      else {
        this.getAllFields(0);
      }
    });
  }

  cptGenModal(item){ 
    this.ref = this.dialogService.open(CptGenModalComponent, {
      header: 'CPT Generation',
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { fieldData:item},
    });    

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this.messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getAllFields(0);
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Error while saving data',
          });
          this.getAllFields(0);
        }
      }
      else {
        this.getAllFields(0);
      }
    });
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}