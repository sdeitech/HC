import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DisplayRuleModel } from '../model/display-rule-model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-add-conditional-question-modal',
  templateUrl: './add-conditional-question-modal.component.html',
  styleUrls: ['./add-conditional-question-modal.component.scss']
})
export class AddConditionalQuestionModalComponent implements OnInit {

  constructor(private _fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private confirmationService: ConfirmationService) { }

  displayForm: FormGroup;
  //Display List:
  displayList: any[];
  selectedDisplay: any;
  isConditional: boolean = false;
  questionList: any[];
  responseList: any[] = [];
  current_question_id: number;
  assessment_id: number;
  selectedDisplayRules: any[] = [];
  selectedResponses: any[] = [];
  base_question_response_type: string;
  is_multi: boolean = false;
  current_question_systemgenerated_id: number = 0;
  sendObj: any[] = [];
  selectedSingleResponse: any[] = [];
  selectedSingleQuestion: any[] = [];
  validateDuplicateQuestion: boolean = false;

  operatorList: any[];
  temp_question_list: any[];

  get displayQuestionArray(): FormArray {
    return this.displayForm.get('displayQuestionArray') as FormArray;
  }

  ngOnInit(): void {
    this.bindDropDownManually();
    this.initDisplayForm();
  }


  AddDisplayFormGroup(data?: any): FormGroup {
    if (data) {
      return this._fb.group({
        question: [data.question],
        response: [data.response],
        relation: [data.relation],
        chk_not_equal: [data.chk_not_equal]
      })
    }
    else {
      return this._fb.group({
        question: [''],
        response: [''],
        relation: [0],
        chk_not_equal: [false]
      })
    }
  }

  deleteRow(index): boolean {
    this.confirmationService.confirm({
      message:
        'Are you sure you wish to delete this Question?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        this.displayQuestionArray.removeAt(index);
        this.responseList.splice(index, 1);
        return true;
      },
    });
    return false;
  }

  addRow() {
    this.displayQuestionArray.push(this.AddDisplayFormGroup());
    this.setDisplayTypeValidations(true);
  }

  initDisplayForm() {
    this.displayForm = this._fb.group({
      displayQuestionArray: this._fb.array([
        this.AddDisplayFormGroup()
      ]),
      display_type: [0, Validators.required]
    })

    if (this.config.data.questionModel != 0) {
      this.questionList = this.config.data.questionModel;
      this.temp_question_list = this.config.data.questionModel;
      this.questionList = this.questionList.filter(x => x.active == true)
      this.questionList.forEach((x) => {
        x.response = x.response.filter(y => y.active == true);
      })
    }

    this.current_question_id = this.config.data.current_question_id;
    this.current_question_systemgenerated_id = this.config.data.current_question_systemgenerated_id
    this.assessment_id = this.config.data.assessment_id;
    this.selectedDisplayRules = this.config.data.selectedDisplayRules;

    if (!this.selectedDisplayRules)
      this.selectedDisplayRules = [];

    if (this.questionList.length > 0) {
      if (this.selectedDisplayRules.length > 0) {

        if (this.selectedDisplayRules[0].display_type == 1) {
          this.isConditional = true;
          this.displayForm.get('display_type').setValue(1);

          //clear form array before pushing rules:
          this.displayQuestionArray.clear();

          let count = 0;
          let checkForRepeated = [];
          //Loop through each rules
          this.selectedDisplayRules.forEach((element, index) => {

            if (element.final_mapping_array) {

              element.final_mapping_array.forEach(maparray => {

                if (!checkForRepeated.find(x => x == (maparray.base_question_id == 0 ? maparray.base_question_system_id
                  : maparray.base_question_id)) || count == 0) {

                  let current_base_question = this.questionList.filter(y => (y.question_id
                    == maparray.base_question_id) &&
                    (y.systemgenerated_question_id == maparray.base_question_system_id));

                  let current_response_options = current_base_question[0].response;

                  //Check Multi Response:
                  if (current_base_question[0].response_type.code == 'MULTI') {

                    let responseArray = element.final_mapping_array.filter(x => (x.base_question_id
                      == maparray.base_question_id) && (x.base_question_system_id
                        == maparray.base_question_system_id));

                    if (responseArray) {
                      let multiResponse = [];
                      responseArray.forEach(response => {
                        let singleResponse = current_response_options.filter(x => (x.response_id
                          == response.base_response_id) && (x.systemgenerated_response_id
                            == response.base_response_system_id))

                        if (singleResponse)
                          multiResponse.push(singleResponse[0]);
                      });

                      let data = {
                        question: current_base_question[0],
                        response: multiResponse,
                        relation: maparray.relation ? 1 : 0,
                        chk_not_equal: maparray.is_not_equal
                      }

                      this.displayQuestionArray.push(this.AddDisplayFormGroup(data));
                      this.responseList.push(current_base_question[0].response);
                    }

                  }
                  else {
                    let singleResponse = current_response_options.filter(x => (x.response_id
                      == maparray.base_response_id) && (x.systemgenerated_response_id
                        == maparray.base_response_system_id))

                    let data = {
                      question: current_base_question[0],
                      response: singleResponse[0],
                      relation: maparray.relation ? 1 : 0,
                      chk_not_equal: maparray.is_not_equal
                    }

                    this.displayQuestionArray.push(this.AddDisplayFormGroup(data));
                    this.responseList.push(current_base_question[0].response);
                  }

                  checkForRepeated.push(maparray.base_question_id == 0 ? maparray.base_question_system_id :
                    maparray.base_question_id);
                  count = count + 1;
                }
              });
            }
            else {
              //first time when directly coming from API saved data:
              if (!checkForRepeated.find(x => x == (element.base_question_id == 0 ? element.systemgenerated_question_id :
                element.base_question_id)) || count == 0) {

                let current_base_question = this.questionList.filter(y => (y.question_id
                  == element.base_question_id));

                let current_response_options = current_base_question[0].response;

                //Check Multi Response:
                if (current_base_question[0].response_type.code == 'MULTI') {

                  let responseArray = this.selectedDisplayRules.filter(x => (x.base_question_id
                    == element.base_question_id));

                  if (responseArray) {
                    let multiResponse = [];
                    responseArray.forEach(response => {
                      let singleResponse = current_response_options.filter(x => (x.response_id
                        == response.base_response_id))

                      if (singleResponse)
                        multiResponse.push(singleResponse[0]);
                    });

                    let data = {
                      question: current_base_question[0],
                      response: multiResponse,
                      relation: element.relation ? 1 : 0,
                      chk_not_equal: element.is_not_equal
                    }

                    this.displayQuestionArray.push(this.AddDisplayFormGroup(data));
                    this.responseList.push(current_base_question[0].response);
                  }

                }
                else {
                  let singleResponse = current_response_options.filter(x => (x.response_id
                    == element.base_response_id))

                  let data = {
                    question: current_base_question[0],
                    response: singleResponse[0],
                    relation: element.relation ? 1 : 0,
                    chk_not_equal: element.is_not_equal
                  }

                  this.displayQuestionArray.push(this.AddDisplayFormGroup(data));
                  this.responseList.push(current_base_question[0].response);
                }

                checkForRepeated.push(element.base_question_id);
                count = count + 1;
              }
            }
          });

          //set dynamic validaiton
          this.setDisplayTypeValidations(true);
        }
      }
    }
  }

  bindDropDownManually() {
    this.displayList = null;
    this.displayList = [
      { name: "Always Show", Id: 0 },
      { name: "Show Conditionally", Id: 1 }
    ];

    this.operatorList = null;
    this.operatorList = [
      { name: "OR", Id: 0 },
      { name: "AND", Id: 1 }
    ];
  }

  onDisplayTypeChange(event) {
    if (event.value == 1) {
      this.isConditional = true;
      this.setDisplayTypeValidations(true);
    }
    else {
      this.isConditional = false;
      this.setDisplayTypeValidations(false);
      this.displayQuestionArray.clear();
    }
  }

  onResponseChange(event, index: number) {
  }

  onQuestionChange(event, index: number) {
    let createResponse;
    if (event.value.question_id != 0) {
      createResponse = this.questionList.filter(x => x.question_id == event.value.question_id);
    }
    else {
      createResponse = this.questionList.filter(x => x.systemgenerated_question_id == event.value.systemgenerated_question_id);
    }

    this.responseList.splice(index, 1, createResponse[0].response);

    if (this.displayQuestionArray.value[index].question.response_type.code == "MULTI") {
      this.is_multi = true;
    }
    else {
      this.is_multi = false;
    }

    //reset array response value:
    this.displayQuestionArray.at(index).get('response').setValue('');

  }

  clickEvent() {
    setTimeout(() => {
      (document.querySelector('.p-dropdown-panel') as HTMLElement).style.left = '30%';
      (document.querySelector('.p-dropdown-items-wrapper') as HTMLElement).style.maxWidth = '742px';
    }, 1);
  }

  setDisplayTypeValidations(Setvalidation: boolean) {
    if (Setvalidation) {

      this.displayQuestionArray.controls.forEach((item: FormControl, _index) => {
        //item.get('question').setValue('');
        item.get('question').setValidators([Validators.required]);
        item.get('question').updateValueAndValidity();

        //item.get('response').setValue('');
        item.get('response').setValidators([Validators.required]);
        item.get('response').updateValueAndValidity();
      });

    }
    else {
      this.displayQuestionArray.controls.forEach((item: FormControl, _index) => {
        //item.get('question').setValue('');
        item.get('question').clearValidators();
        item.get('question').updateValueAndValidity();

        //item.get('response').setValue('');
        item.get('response').clearValidators();
        item.get('response').updateValueAndValidity();

      });
    }
  }


  onSubmit() {
    var finalData = this.displayForm.getRawValue();

    //return;

    if (this.displayForm.invalid)
      return;

    if (finalData.display_type == 0) {

      let resposneObj = {
        display_type: finalData.display_type,
        assessment_id: this.assessment_id,
        question_id: this.current_question_id,
        question_system_id: this.current_question_systemgenerated_id,
        final_mapping_array: []
      }

      this.sendObj.push(resposneObj);

      //this.loading = false;
      this.ref.close({ data: this.sendObj });
    }
    else {
      if (this.displayQuestionArray.length == 0)
        return;

      let presentElement = [];
      let duplicateFound = 0;
      this.displayQuestionArray.controls.forEach((item: FormControl, _index) => {
        if (item.value.question.question_id == 0) {
          let question_id = item.value.question.systemgenerated_question_id;

          if (presentElement.find(present => present == question_id)) {
            this.validateDuplicateQuestion = true;
            duplicateFound = duplicateFound + 1;
          }
          else {
            presentElement.push(question_id);
          }
        }
        else {
          let question_id = item.value.question.question_id;

          if (presentElement.find(present => present == question_id)) {
            this.validateDuplicateQuestion = true;
            duplicateFound = duplicateFound + 1;
          }
          else {
            presentElement.push(question_id);
          }
        }
      });

      if (duplicateFound > 0) {
        return;
      }

      let finalMappingObject = [];

      //apply relation validation if length > 1
      this.displayQuestionArray.controls.forEach((item: FormControl, _index) => {

        if (item.get('question').value.response_type.code == 'MULTI') {
          //MultiSelect Response:
          item.get('response').value.forEach(element => {
            let singleObject = {
              base_question_id: item.get('question').value.question_id,
              base_question_system_id: item.get('question').value.systemgenerated_question_id,
              base_response_id: element.response_id,
              base_response_system_id: element.systemgenerated_response_id,
              is_not_equal: item.get('chk_not_equal').value,
              relation: item.get('relation').value,
              rank: _index
            }

            finalMappingObject.push(singleObject);
          });
        } else {
          let singleObject = {
            //this.patientLabDetails.controls[index].get('result')
            base_question_id: item.get('question').value.question_id,
            base_question_system_id: item.get('question').value.systemgenerated_question_id,
            base_response_id: item.get('response').value.response_id,
            base_response_system_id: item.get('response').value.systemgenerated_response_id,
            is_not_equal: item.get('chk_not_equal').value,
            relation: item.get('relation').value,
            rank: _index
          }

          finalMappingObject.push(singleObject);
        }
      });

      let createObj = {
        display_type: finalData.display_type,
        assessment_id: this.assessment_id,
        question_id: this.current_question_id,
        question_system_id: this.current_question_systemgenerated_id,
        final_mapping_array: finalMappingObject
      }

      this.sendObj.push(createObj);

      this.ref.close({ data: this.sendObj });
    }
  }
}
