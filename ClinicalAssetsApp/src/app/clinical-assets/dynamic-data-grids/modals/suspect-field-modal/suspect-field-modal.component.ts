import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicianSummaryService } from 'src/app/services/provider';
import { ClinicalAssetService } from '../../../services/clinical-asset.service';

@Component({
  selector: 'app-suspect-field-modal',
  templateUrl: './suspect-field-modal.component.html',
  styleUrls: ['./suspect-field-modal.component.scss']
})
export class SuspectFieldModalComponent implements OnInit {
  loading = false;
  operatorList = [
    { id: 1, name: "Equals" }
  ];
  operatorTxtList = [
    { id: 1, name: "Equals" },
    { id: 2, name: "Between" },
    { id: 3, name: "Less than or equal" },
    { id: 4, name: "Greater than" },
    { id: 5, name: "Less than" },
    { id: 6, name: "Greater than or equal" }
  ];
  textWithInteger = false;
  textWithoutInteger = false;
  selectType = false;
  response_list: any = [];
  textIntFalseList: any = [];
  selectList: any = [];
  textIntTrueList: any = [];
  field_id: number;
  field_type_id: number;
  filteredIcdCodes: any = [];
  dataNotValid = false;
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService,
    private clinicianSummaryService: ClinicianSummaryService) {

    if (config.data.fieldData != null) {
      this.field_id = config.data.fieldData.id;
      this.field_type_id = config.data.fieldData.field_type_id;
      this.setInit(config.data.fieldData);
      this.setSuspectData(config.data.fieldData.field_suspects);
      this.fillresponse(config.data.fieldData.field_response);
    }
  }

  ngOnInit(): void {
  }

  getIcdcode(event: any) {
    if (event.query.length > 2) {
      setTimeout(() => {
        this.clinicianSummaryService
          .GeticdCode(event.query)
          .subscribe(
            (result: any) => {
              if (result && result.body)
                this.filteredIcdCodes = result.body;
            });
      }, 500);
    }
  }

  onsubmit() {
    this.dataNotValid = false;
    if (!this.validateData()) {
      this.dataNotValid = true;
      return;
    }
    const obj = { dgFieldCodes: this.fillSuspectData() };
    this.clinicalAssetService.CreateNewFieldSuspectData(obj).subscribe(
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

  addSuspect() {
    if (this.textWithInteger) {
      this.textIntTrueList.push({
        operator: null,
        qualifier_value: null,
        min_value: null,
        max_value: null,
        suspect: null,
        showValidIcdmsg: false,
        icdRequired: false
      });
    }
    if (this.textWithoutInteger) {
      this.textIntFalseList.push({
        enter_value: '',
        operator: null,
        suspect: null,
        showValidIcdmsg: false,
        icdRequired: false
      });
    }
    if (this.selectType) {
      this.selectList.push({
        response_id: 0,
        suspect: null,
        showValidIcdmsg: false,
        icdRequired: false
      });
    }
  }

  setInit(data) {
    if (data.field_type_id == 1) {
      if (data.is_integer_only != null && data.is_integer_only) {
        this.textWithInteger = true;
      } else { this.textWithoutInteger = true; }
    }
    if (data.field_type_id == 7) {
      this.textWithInteger = true;
    }
    if (data.field_type_id == 3 || data.field_type_id == 4) {
      this.selectType = true;
    }
  }

  setSuspectData(data) {
    if (data != null) {
      data.forEach(i => {
        this.textIntTrueList.push({
          id: i.id,
          operator: i.trigger_type,
          qualifier_value: i.qualifier_value,
          min_value: i.trigger_range_min,
          max_value: i.trigger_range_max,
          suspect: { id: i.suspect_icd10, name: i.suspect_code + " - " + i.suspect_description, description: i.suspect_description, icdCode: i.suspect_code },
          showValidIcdmsg: false,
          icdRequired: false
        });
        this.textIntFalseList.push({
          id: i.id,
          enter_value: i.text_value,
          operator: i.trigger_type,
          suspect: { id: i.suspect_icd10, name: i.suspect_code + " - " + i.suspect_description, description: i.suspect_description, icdCode: i.suspect_code },
          showValidIcdmsg: false,
          icdRequired: false
        });
        this.selectList.push({
          id: i.id,
          response_id: i.trigger_match,
          suspect: { id: i.suspect_icd10, name: i.suspect_code + " - " + i.suspect_description, description: i.suspect_description, icdCode: i.suspect_code },
          showValidIcdmsg: false,
          icdRequired: false
        });
      });
    }
  }

  validateData() {
    let isValid = true;
    if (this.textWithInteger && isValid) {
      if (this.textIntTrueList.length > 0) {
        this.textIntTrueList.forEach(i => {
          if (!this.checkOperator(i, true) && isValid)
            isValid = false;
          if (isValid && i.suspect == null && isValid) { i.icdRequired = true; isValid = false; }
          if (isValid && !i.icdRequired && !i.suspect.hasOwnProperty('id')) {
            i.showValidIcdmsg = true;
            isValid = false
          }
          if (!isValid) return;
        });
      }
    }
    if (this.textWithoutInteger && isValid) {
      if (this.textIntFalseList != null && this.textIntFalseList.length > 0) {
        this.textIntFalseList.forEach(i => {
          if (!this.checkOperator(i, false) && isValid)
            isValid = false;
          if (i.suspect == null && isValid) { i.icdRequired = true; isValid = false; }
          if (isValid && i.icdRequired == false && !i.suspect.hasOwnProperty('id')) {
            i.showValidIcdmsg = true;
            isValid = false
          }
          if (!isValid) return;
        });
      }
    }
    if (this.selectType && isValid) {
      if (this.selectList != null && this.selectList.length > 0) {
        this.selectList.forEach(i => {
          if (i.response_id == null || i.response_id == "") isValid = false;
          if (isValid && i.suspect == null) { i.icdRequired = true; isValid = false; }
          if (isValid && !i.icdRequired && !i.suspect.hasOwnProperty('id')) {
            i.showValidIcdmsg = true;
            isValid = false
          }
          if (!isValid) return;
        });
      }
    }
    return isValid;
  }

  checkOperator(item, isInt): Boolean {
    switch (item.operator) {
      case 'Equals':
      case 'Less than or equal':
      case 'Greater than':
      case 'Less than':
      case 'Greater than or equal':
        if (isInt) { if (item.qualifier_value == null) return false; }
        if (!isInt) { if (item.enter_value == null) return false; }
        break;
      case 'Between':
        if (isInt) {
          if ((item.min_value == null || item.max_value == null)) return false;
          else if (item.min_value > item.max_value) return false;
        }
        break;
      default:
        return false;
    }
    return true;
  }

  fillSuspectData() {
    let data = [];
    if (this.textWithInteger) {
      if (this.textIntTrueList.length > 0) {
        this.textIntTrueList.forEach(i => {
          data.push({
            id: i.id,
            suspect_icd10: i.suspect.id,
            field_id: this.field_id,
            field_type_id: this.field_type_id,
            trigger_type: i.operator,
            trigger_match: null,
            trigger_range_min: i.min_value,
            trigger_range_max: i.max_value,
            qualifier_value: i.qualifier_value,
            text_value: null,
          })
        });
      }
    }
    if (this.textWithoutInteger) {
      if (this.textIntFalseList != null && this.textIntFalseList.length > 0) {
        this.textIntFalseList.forEach(i => {
          data.push({
            id: i.id,
            suspect_icd10: i.suspect.id,
            field_id: this.field_id,
            field_type_id: this.field_type_id,
            trigger_type: i.operator,
            trigger_match: null,
            trigger_range_min: null,
            trigger_range_max: null,
            qualifier_value: null,
            text_value: i.enter_value,
          })
        });
      }
    }
    if (this.selectType) {
      if (this.selectList != null && this.selectList.length > 0) {
        this.selectList.forEach(i => {
          data.push({
            id: i.id,
            suspect_icd10: i.suspect.id,
            field_id: this.field_id,
            field_type_id: this.field_type_id,
            trigger_type: "Match",
            trigger_match: i.response_id,
            trigger_range_min: null,
            trigger_range_max: null,
            qualifier_value: null,
            text_value: null,
          })
        });
      }
    }
    return data;
  }

  fillresponse(data) {
    if (data != null && data.length > 0) {
      data.forEach(i => {
        this.response_list.push({
          id: i.id,
          name: i.name
        })
      });
    }
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
