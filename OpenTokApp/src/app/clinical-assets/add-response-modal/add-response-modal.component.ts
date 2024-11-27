import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicianSummaryService } from '../../provider/services/clinician-summary.service';
import { UsersRoleService } from '../../users-and-roles/services/users-role.service';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { DataSharingService } from '../services/datasharing.service';

@Component({
  selector: 'app-add-response-modal',
  templateUrl: './add-response-modal.component.html',
  styleUrls: ['./add-response-modal.component.scss']
})
export class AddResponseModalComponent implements OnInit {
  addResponseForm: FormGroup;
  isunsaved:boolean;
  idealChoice: any[];
  questionText: any;
  isScroable: boolean;
  loading: boolean = false;
  filteredCPTCodes:any;
  cpt_code:any;
  showValidCptmsg: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public messageService: MessageService,
    private dataSharingService: DataSharingService,
    private clinicianSummaryService: ClinicianSummaryService
  ) {
    this.idealChoice = [
      { name: 'Yes', id: true },
      { name: 'No', id: false }
    ];
  }

  ngOnInit(): void {
    this.questionText = this.config.data.questionDetails.question
    this.createForm();
    this.isScroable = this.config.data.isScroable;
    if (!this.isScroable) {
      this.addResponseForm.get('score').clearValidators();
    } else {
      this.addResponseForm.get('score').setValidators(Validators.required);
    }
    if(!this.config.data.responseModel.ideal_choice){
      this.addResponseForm.get('ideal_choice').setValue(this.idealChoice.find(x=>x.id== false));
    }  
  }

  createForm() {
    this.addResponseForm = this.fb.group({
      response: ['', Validators.required],
      score: [''],
      ideal_choice: ['', Validators.required],
      assessment_id: ['', ''],
      question_id: [0, ''],
      response_id: [0, ''],
      systemgenerated_response_id: [0, ''],
      systemgenerated_question_id: ['', ''],
      cpt_code:['','']
    });
    if (this.config.data.responseModel != 0) {
      this.addResponseForm.get('response').setValue(this.config.data.responseModel.response)
      this.addResponseForm.get('score').setValue(this.config.data.responseModel.score)
      this.addResponseForm.get('ideal_choice').setValue(this.config.data.responseModel.ideal_choice == true ? { "name": "Yes", "id": true } : { "name": "No", "id": false });
      this.addResponseForm.get('systemgenerated_response_id').setValue(this.config.data.responseModel.systemgenerated_response_id)
      this.fillCPTCode(this.config.data.responseModel);
      this.addResponseForm.get('cpt_code').setValue(this.cpt_code);
      
    }

    this.addResponseForm.get('assessment_id').setValue(this.config.data.questionDetails.assessment_id)
    this.addResponseForm.get('question_id').setValue(this.config.data.questionDetails.question_id)
    this.addResponseForm.get('response_id').setValue(this.config.data.questionDetails.response_id)
    this.addResponseForm.get('systemgenerated_question_id').setValue(this.config.data.questionDetails.systemgenerated_question_id)
  }

  questionResponseExists(name) {
    var responseList = this.config.data.questionResponseList.response;    
    return this.config.data.responseList.response.some(function (el) {
      return el.response === name;
    });
  }
  editQuestionResponseExists(name, systemId, id) {
    var t= this.config.data.responseList.response.filter(x=>x.systemgenerated_question_id == id && x.response == name && x.systemgenerated_response_id != systemId);
    if(t.length ==0)
    {
      return false;
    }
    else 
    return true;
  }

  fillCPTCode(data){
    if(data.cpt_code_id != null && data.cpt_code != null)
    {
      this.cpt_code = { id: data.cpt_code_id, name:data.cpt_code + " - "+data.cpt_description , description:data.cpt_description , cptCode:data.cpt_code  }; 
    }
  }

  newQuestionResponseExist(name, systemId, id) {
    var question = this.config.data.responseList.response.find(obj => obj.response === name);
    if (question != undefined) {
      if (question.response_id == id) {
        return false;
      }
      else
        return true;
    }
    else return false;
  }

  onSubmit(value) {
    this.loading = true;
    if (this.addResponseForm.invalid) {
      this.loading = false;
      return;
    }
    if(this.cpt_code != undefined && !this.cpt_code.hasOwnProperty('id')) {
      this.showValidCptmsg = true;
      this.loading = false;
      return;
    }
    if(this.cpt_code != undefined && this.cpt_code.hasOwnProperty('id')){
      value.cpt_code_id = this.cpt_code.id;
      value.cpt_description = this.cpt_code.description;
      value.cpt_code = this.cpt_code.cptCode;
    }
    value.ideal_choice = value.ideal_choice.id == 1 ? true : false;
    value.response = value.response.trim();

    if (value.response_id == undefined) {
      value.response_id = 0;
    }
    let y = this.config.data.questionResponseList;
    if (this.config.data.responseModel == 0) {
      if (this.questionResponseExists(value.response)) {
        this.loading = false;
        this.messageService.add({ severity: 'info', summary: 'Response already exist' });
        return;
      }
    }
    else {
      if (value.systemgenerated_response_id == 0) {
        if (this.newQuestionResponseExist(value.response, value.systemgenerated_response_id, value.response_id)) {
          this.loading = false;
          this.messageService.add({ severity: 'info', summary: 'Response already exist' });
          return;
        }
      }
      else {
        if (this.editQuestionResponseExists(value.response, value.systemgenerated_response_id, value.systemgenerated_question_id)) {
          this.loading = false;
          this.messageService.add({ severity: 'info', summary: 'Response already exist' });
          return;
        }
      }

    }
    this.loading = false;
    this.dataSharingService.isUnsaved.next(true);
    this.ref.close({ data: value });
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  getCPTCode(event: any) {
    if (event.query.length > 2) {
      setTimeout(() => {
        this.clinicianSummaryService
          .GetcptCode(event.query)
          .subscribe(
            (result: any) => {
              if (result && result.body)
                this.filteredCPTCodes = result.body;
            });
      }, 500);
    }
  }
}
