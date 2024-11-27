import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../services/clinical-asset.service';

@Component({
  selector: 'new-field-modal',
  templateUrl: './new-field-modal.component.html',
  styleUrls: ['./new-field-modal.component.scss']
})
export class NewFieldModalComponent implements OnInit {
  statusList: any[];
  fieldTypeList: any[];
  id=0;  
  createFieldForm:any;
  loading: boolean = false;  
  dataGridId:any;
  fieldType:number;
  minValue = 0;
  maxValue = this.minValue + 10;
  chkIsInteger=false;
  maxValueError=false;
  lookupList:any;
  selectedFieldData:any;
  dgFieldCalcData:any;
  calcField1List:any = [ ];
  calcField2List:any = [ ];
  calcField1TransList:any;
  calcField2TransList:any;
  calcOperatorList:any;  
  allDgFieldList:any;
  chkPostOperator = false;
  calcField1:number;
  calcField2:number;
  calcBetweenField:any;
  ddPostOperator:any;
  fieldName='';
  calculatePreview = '';
  calcField1Text:any;
  calcField2Text:any;
  calcField1Preview:any;
  calcField2Preview:any;
  postPreview:any;
  txtPostOperator:number;
  calcField1Trans = 'None';
  calcField2Trans = 'None';
  betweenOpt = '';
  lookUpDataset:any;
  fieldCalcId = 0;
  fieldTooltip = null;
  status = true;
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder, 
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService) {
      if(config.data.fieldData == null){
        this.id = 0;
      }
      else{
        this.id = config.data.fieldData.id;
        this.selectedFieldData = config.data.fieldData;         
        this.dgFieldCalcData = config.data.fieldCalcData;       
      }
      this.dataGridId = config.data.gridId;
      this.fieldTypeList = config.data.fieldTypesData;
      this.lookupList = config.data.lookupDatasets;
      if(this.lookupList != null && this.lookupList != undefined){
        this.lookUpDataset = this.lookupList[0].id;
      }
      this.allDgFieldList = config.data.allDgFields;
      this.statusList = [
        { id: true, name: 'Active' },
        { id: false, name: 'Disabled' },
      ];
      this.initCalculatedField();
     }

  ngOnInit(): void {
      this.initForm();
  }

  fillCalcInput(formData:any){
    if(this.fieldType == 7){
      return {
        id:this.fieldCalcId,
        calc_field1:formData.calcField1,
        calc_field1_transformation:formData.calcField1Trans,
        calc_field2:formData.calcField2,
        mid_operator:formData.calcBetweenField,
        calc_field2_transformation:formData.calcField2Trans,
        enable_post_operator:formData.chkPostOperator,
        post_operator:formData.ddPostOperator,
        post_operator_val:formData.txtPostOperator,
        field_id:this.id,    
      }
    }
    else
    return null;
  }
  checkAndUpdateOrders(){
    let existingRecord = this.allDgFieldList.filter(x=>x.id == this.selectedFieldData.id);
    if(existingRecord!=null && existingRecord.length == 1){
      existingRecord.forEach(existingStatus =>{
        if(existingStatus.status && this.status == existingStatus.status){
          this.selectedFieldData.tabular_sort_order = existingStatus.tabular_sort_order;
          this.selectedFieldData.detail_sort_order = existingStatus.detail_sort_order;
        } else if(!existingStatus.status && this.status != existingStatus.status) {  
          let activeFields = this.allDgFieldList.filter(x=>x.status);
          this.selectedFieldData.tabular_sort_order = activeFields != null && activeFields.length > 0 ? activeFields.length + 1 : 1;
          this.selectedFieldData.detail_sort_order = activeFields != null && activeFields.length > 0 ? activeFields.length + 1 : 1;;   
        }
        else {               
          this.selectedFieldData.tabular_sort_order = 0;
          this.selectedFieldData.detail_sort_order = 0;          
        }
      });
    }
  }
  onSubmit(formData: any){            
    if (!this.createFieldForm.valid || this.maxValueError) return;
    this.loading = true;
    let activeFields = this.allDgFieldList.filter(x=>x.status);
    const obj = {
      id:formData.id,
      name:formData.fieldName.trim(),
      field_type_id:formData.fieldType,
      field_tooltip:this.fieldTooltip,
      is_required:formData.chkIsRequired,
      is_integer_only:formData.chkIsInteger,
      integer_validation_min:formData.minValue,
      integer_validation_max:formData.maxValue,
      lookup_dataset: formData.fieldType == 6 ? this.lookUpDataset : null,
      datagrid_id:this.dataGridId,
      status:this.status,
      show_in_tabular:formData.chkshowInTabular,
      tabular_sort_order: this.id == 0 ? (activeFields != null && activeFields.length > 0) ? activeFields.length + 1 : 1 : this.selectedFieldData.tabular_sort_order,
      show_in_detail:formData.chkshowInDetail,
      detail_sort_order: this.id == 0 ? (activeFields != null && activeFields.length > 0) ? activeFields.length + 1 : 1 : this.selectedFieldData.detail_sort_order,      
      dgFieldCalculation:this.fillCalcInput(formData)
    }

    this.clinicalAssetService.AddUpdateDgField(obj).subscribe(
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

  onBlurMaxValue(){
    if(this.minValue > this.maxValue)
      this.maxValueError = true;
    else
      this.maxValueError = false;
  }  

  enableField(item){
    switch(item.field_type_id){
      case 1:
        this.createFieldForm.controls['chkIsInteger'].setValue(item.is_integer_only);
        break;
    }
  }

  initCalculatedField(){
    if(this.allDgFieldList != null){
      this.allDgFieldList.forEach((item)=>{
        if(item.field_type_id == 1 && item.is_integer_only != null && item.is_integer_only){
          this.calcField1List.push({ id: item.id, name: item.name });
          this.calcField2List.push({ id: item.id, name: item.name });    
        }
      });
    }
    this.calcField1TransList = [
      {id:0,name:"None"},
      {id:1,name:"Squared"}
    ];
    this.calcField2TransList = [
      {id:0,name:"None"},
      {id:1,name:"Squared"}
    ];
    this.calcOperatorList = [
      {id:1,name:"+ Plus"},
      {id:1,name:"- Minus"},
      {id:1,name:"/ Divide"},
      {id:1,name:"x Multiply"},
    ];
  } 

  calcField1Event(event){
    this.calcField1Text = event.originalEvent.srcElement.innerText;
    this.calculationPreview();
    
  }
  calcField2Event(event){
    this.calcField2Text = event.originalEvent.srcElement.innerText;
    this.calculationPreview();
  }

  initForm(){
    let name = this.fieldName;  
    let toolTip = this.fieldTooltip;  
    if(this.id == 0)
    {      
      this.createFieldForm = this._fb.group({
        id:[this.id],
        fieldType:(this.fieldType != undefined ? this.fieldType : new FormControl('',Validators.required)),
        fieldName: [name, [Validators.required]],
        chkIsInteger: [false],
        status:[true,[Validators.required]],
        minValue: [null],
        maxValue: [null],
        chkshowInTabular: [true],        
        chkshowInDetail: [true],
        chkIsRequired:[false],
        //lookUpDataset:new FormControl(null),
        lookUpDataset:this.fieldType!==6? new FormControl(null):new FormControl('',Validators.required),
        calcField1:new FormControl(''),
        calcField2:new FormControl(''),
        calcField1Trans: new FormControl(this.calcField1Trans),
        calcField2Trans: new FormControl(this.calcField2Trans),
        calcBetweenField:new FormControl(''),
        chkPostOperator:[false],
        ddPostOperator:new FormControl(''),
        txtPostOperator: [null],
        fieldTooltip:[toolTip]
      });
    }
    else{                 
      this.createFieldForm = this._fb.group({
        id:[this.id],     
        fieldType: [this.selectedFieldData.field_type_id],   
        fieldName: [this.selectedFieldData.name, [Validators.required]],        
        status:[this.selectedFieldData.status,[Validators.required]],
        chkshowInTabular: [this.selectedFieldData.show_in_tabular],        
        chkshowInDetail: [this.selectedFieldData.show_in_detail],
        chkIsRequired:[this.selectedFieldData.is_required],
        chkIsInteger:[this.selectedFieldData.is_integer_only],
        minValue: [this.selectedFieldData.integer_validation_min],
        maxValue: [this.selectedFieldData.integer_validation_max],
        lookUpDataset:new FormControl(null),
        calcField1:new FormControl(''),
        calcField2:new FormControl(''),
        calcField1Trans: new FormControl(''),
        calcField2Trans: new FormControl(''),
        calcBetweenField:new FormControl(''),
        chkPostOperator:[false],
        ddPostOperator:new FormControl(''),
        txtPostOperator: [null],
        fieldTooltip : [this.selectedFieldData.field_tooltip]
      });      
      this.fieldType = this.selectedFieldData.field_type_id;
      this.chkIsInteger = this.selectedFieldData.is_integer_only
      this.fieldName = this.selectedFieldData.name;
      this.fieldTooltip = this.selectedFieldData.field_tooltip;
      this.minValue = this.selectedFieldData.integer_validation_min;
      this.maxValue = this.selectedFieldData.integer_validation_max;
      this.status = this.selectedFieldData.status;
       
      if(this.selectedFieldData.field_type_id == 6){        
        this.createFieldForm.controls["lookUpDataset"].setValue(this.selectedFieldData.lookup_dataset);
        this.lookUpDataset = this.selectedFieldData.lookup_dataset;
      }

      this.setCalcFields();
    }    
    this.initRequiredField();
  }

  initRequiredField(){    
    //Calculated field type    
    if(this.fieldType == 7){
      this.createFieldForm.controls['calcField1'].setValidators([Validators.required]);
      this.createFieldForm.controls['calcField2'].setValidators([Validators.required]);
      this.createFieldForm.controls['calcBetweenField'].setValidators([Validators.required]);
      //check post operator checkbox
      if(this.chkPostOperator){
        this.createFieldForm.controls['ddPostOperator'].setValidators([Validators.required]);
        this.createFieldForm.controls['txtPostOperator'].setValidators([Validators.required]);
      }
      else{
        this.createFieldForm.controls['ddPostOperator'].clearValidators();
        this.createFieldForm.controls['ddPostOperator'].updateValueAndValidity();
        this.createFieldForm.controls['txtPostOperator'].clearValidators();
        this.createFieldForm.controls['txtPostOperator'].updateValueAndValidity();
      }
    }
    this.calculationPreview();
  }

  calculationPreview(){
    this.calcField1Preview = '';
    this.calcField2Preview = '';
    this.postPreview = '';
    this.betweenOpt ='';
    if(this.calcField1 != undefined && this.calcField2 != undefined && this.calcBetweenField != undefined){      
      this.calcField1Preview = this.calcField1Text;
      this.betweenOpt = " "+this.calcBetweenField.charAt(0)+" ";
      if(this.calcField1Trans == "Squared"){
        this.calcField1Preview = "("+ this.calcField1Preview + ") ";
      }
      this.calcField2Preview = this.calcField2Text;
      if(this.calcField2Trans == "Squared"){
        this.calcField2Preview = "("+ this.calcField2Preview +")";
      }
      if(this.chkPostOperator && this.ddPostOperator != undefined && this.txtPostOperator != undefined){
        this.calcField1Preview = "("+ this.calcField1Preview;        
        this.postPreview = ") "+ this.ddPostOperator.charAt(0) +" "+ this.txtPostOperator;        
      }
    }
  }

  setCalcFields(){
    if(this.fieldType == 7){        
      this.createFieldForm.controls["calcField1"].setValue(this.dgFieldCalcData.calc_field1);
      this.createFieldForm.controls["calcField2"].setValue(this.dgFieldCalcData.calc_field2);
      this.createFieldForm.controls["calcField1Trans"].setValue(this.dgFieldCalcData.calc_field1_transformation);
      this.createFieldForm.controls["calcField2Trans"].setValue(this.dgFieldCalcData.calc_field2_transformation);
      this.createFieldForm.controls["calcBetweenField"].setValue(this.dgFieldCalcData.mid_operator);
      this.createFieldForm.controls["chkPostOperator"].setValue(this.dgFieldCalcData.enable_post_operator);
      this.createFieldForm.controls["ddPostOperator"].setValue(this.dgFieldCalcData.post_operator);
      this.createFieldForm.controls["txtPostOperator"].setValue(this.dgFieldCalcData.post_operator_val); 

      this.fieldCalcId = this.dgFieldCalcData.id;
      this.calcField1 = this.dgFieldCalcData.calc_field1;
      this.calcField2 = this.dgFieldCalcData.calc_field2;
      this.calcField1Trans = this.dgFieldCalcData.calc_field1_transformation;
      this.calcField2Trans = this.dgFieldCalcData.calc_field2_transformation;      
      this.chkPostOperator = this.dgFieldCalcData.enable_post_operator;      
      this.txtPostOperator = this.dgFieldCalcData.post_operator_val; 
      
      this.calcOperatorList.forEach(i=>{
        if(i.name.substring(2)==this.dgFieldCalcData.mid_operator){
          this.calcBetweenField = i.name;
        }
        if(i.name.substring(2)==this.dgFieldCalcData.post_operator){
          this.ddPostOperator = i.name;
        }
      });      
      this.calcField1List.forEach(i=>{
        if(i.id == this.calcField1){
          this.calcField1Text = i.name;
        }
      })
      this.calcField2List.forEach(i=>{
        if(i.id == this.calcField2){
          this.calcField2Text = i.name;
        }
      })
    }     
  }
}
