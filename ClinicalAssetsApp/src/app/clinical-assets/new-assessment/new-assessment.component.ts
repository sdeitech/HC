import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddConditionalQuestionModalComponent } from '../add-conditional-question-modal/add-conditional-question-modal.component';
import { AddQuestionModalComponent } from '../add-question-modal/add-question-modal.component';
import { AddResponseModalComponent } from '../add-response-modal/add-response-modal.component';
import { AddScoreModalComponent } from '../add-score-modal/add-score-modal.component';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { DataSharingService } from '../services/datasharing.service';
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AddContentBlockModalComponent } from '../add-content-block-modal/add-content-block-modal.component';

interface SampleData {
  name: string
}

interface SampleMultiSelectData {
  name: string
}

@Component({
  selector: 'new-assessment',
  templateUrl: './new-assessment.component.html',
  styleUrls: ['./new-assessment.component.scss']
})
export class NewAssessmentComponent implements OnInit {
  ref: DynamicDialogRef;
  assessment_id: number = 0;
  questionsData: any;
  assessmentForm: FormGroup;
  scorable: boolean;
  assessmentdata: any;
  questionsList: any[] = [];
  responselist: any[] = [];
  scoreList: any[] = [];
  roles: any[] = [];
  orderForm: FormGroup;
  questions: FormArray;
  isunsaved: boolean = false;
  is_sc: boolean = false;
  questionResponse: any[] = [];
  contentResponse: any[] = [];
  selectedProject: any[] = [];
  masterRole: any[] = []; masterRole2: any[] = [];
  masterRole3: any[] = [];
  systemgenerated_question_id: number = 0;
  systemgenerated_contentBlock_id: number = 0;
  systemgenerated_response_id: number = 0;
  systemgenerated_score_id: number = 0;
  masterResponseTypes: any[] = [];
  selectedRoles: any[] = [];
  loading: boolean = false;
  saving: boolean = false;
  constructor(
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public messageService: MessageService,
    public dialogService: DialogService,
    private clinicalAssetService: ClinicalAssetService,
    private _router: Router,
    private confirmationService: ConfirmationService,
    private dataSharingService: DataSharingService,
    private cdr: ChangeDetectorRef

  ) {

    this.assessment_id = +atob(this._route.snapshot.queryParamMap.get('assessment_id'));
    if (this.assessment_id == 0) {
      this.getMasterData()
    }
    else {
      this.getAssessmentDetails();
    }
    this.dataSharingService.isUnsaved.subscribe(value => {
      this.isunsaved = value;
    });
  }


  ngOnInit(): void {
    this.init();
    this.isunsaved = false;
  }

  init() {
    this.orderForm = this.formBuilder.group({
      assessment_id: [''],
      name: ['', Validators.required],
      is_scoreable: [new FormControl('')],
      questions: new FormControl(''),
      score_range: new FormControl(''),
      roles: ['', Validators.required]
    });
  }

  getAssessmentDetails() {
    this.loading = true;
    this.clinicalAssetService.getAssessmentDetails(this.assessment_id).subscribe(
      (result: any) => {
        this.loading = false;
        this.assessmentdata = result.assesmentDetail;
        this.questionsData = result.questions;
        this.responselist = result.response;
        this.roles = result.roles;
        this.scoreList = result.score;
        this.questionResponse = result.questionresponse;
        this.contentResponse = result.assessmentContentLists;
        this.populateDataforAssessment(result)
        this.getMasterData();
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  private populateDataforAssessment(questionData: any) {
    this.orderForm.controls['assessment_id'].setValue(questionData.assesmentDetail.name);
    this.orderForm.controls['name'].setValue(questionData.assesmentDetail.name);
    this.orderForm.controls['is_scoreable'].setValue(questionData.assesmentDetail.is_scoreable);
    this.scorable = questionData.assesmentDetail.is_scoreable;
  }

  openQuestionModal(value, state) {
    this.ref = this.dialogService.open(AddQuestionModalComponent, {
      header: state == 'add' ? 'Create Question ' : 'Edit Question',
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { questionModel: value, allQuestions: this.questionResponse },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.question) {
          if (state == 'add') {
            let newpro = {
              assessment_id: this.assessment_id,
              question_id: state == 'add' ? 0 : value.question_id,
              question: result.data.question,
              response_type: "",
              content: "",
              sort_order: 0,
              active: true,
              response: [],
              displayRules: [],
              systemgenerated_question_id: state == 'add' ? this.systemgenerated_question_id + 1 : 0
            }
            if (state == 'add') // system generated question id
              this.systemgenerated_question_id = this.systemgenerated_question_id + 1;
            this.questionResponse.push(newpro);
            this.messageService.add({ severity: 'success', summary: 'Question Added' });
          }
          else {
            if (result.data.question_id == 0) {
              this.questionResponse.forEach((x) => {
                if (x.systemgenerated_question_id == result.data.systemgenerated_question_id) {
                  x.question = result.data.question
                }
              })
              this.messageService.add({ severity: 'success', summary: 'Question Updated' });
            }
            else if (result.data.systemgenerated_question_id == 0) {
              this.questionResponse.forEach((x) => {
                if (x.question_id == result.data.question_id) {
                  x.question = result.data.question
                }
              })
              this.messageService.add({ severity: 'success', summary: 'Question Updated' });
            }
          }
        }
        else {
          this.messageService.add({ severity: 'info', summary: 'Error', detail: result.errorDetail })
        }
      }

    });
  }

  addContentModal(value, state) {
    this.ref = this.dialogService.open(AddContentBlockModalComponent, {
      header: state == 'add' ? 'Add Content Block' : 'Edit Content Block',
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { contentModel: value, allContent: this.contentResponse },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.content_block) {
          if (state == 'add') {
            let newpro = {
              assessment_id: this.assessment_id,
              contentBlock_id: state == 'add' ? 0 : value.contentBlock_id,
              content_block: result.data.content_block,
              active: true,
              systemgenerated_contentBlock_id: state == 'add' ? this.systemgenerated_contentBlock_id + 1 : 0
            }
            if (state == 'add') {
              this.systemgenerated_contentBlock_id = this.systemgenerated_contentBlock_id + 1;
              this.contentResponse.push(newpro);
              this.messageService.add({ severity: 'success', summary: 'Content Added' });
            }
          }
          else {
            if (result.data.contentBlock_id == 0) {
              this.contentResponse.forEach((x) => {
                if (x.systemgenerated_contentBlock_id == result.data.systemgenerated_contentBlock_id) {
                  x.content_block = result.data.content_block
                }
              })
              this.messageService.add({ severity: 'success', summary: 'Content Updated' });
            }
            else if (result.data.systemgenerated_contentBlock_id == 0) {
              this.contentResponse.forEach((x) => {
                if (x.contentBlock_id == result.data.contentBlock_id) {
                  x.content_block = result.data.content_block
                }
              })
              this.messageService.add({ severity: 'success', summary: 'Content Updated' });
            }
          }
        }
        else {
          this.messageService.add({ severity: 'info', summary: 'Error', detail: result.errorDetail })
        }
      }

    });
  }

  openResponseModal(value, responseList, state) {
    this.ref = this.dialogService.open(AddResponseModalComponent, {
      header: state == 'add' ? 'Create Response ' : 'Update Response',
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { responseModel: state == 'add' ? 0 : value, questionDetails: value, isScroable: this.scorable, questionResponseList: this.questionResponse.find(f => f.question_id == value.question_id || f.question == value.question), responseList: responseList },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data) {
          if (state == 'add') {
            var resposne = {
              assessment_id: this.assessment_id,
              question_id: value.question_id,
              response: result.data.response,
              sort_order: value.response.length + 1,
              response_id: 0,
              active: true,
              score: +result.data.score,
              ideal_choice: result.data.ideal_choice,
              systemgenerated_question_id: value.systemgenerated_question_id,
              systemgenerated_response_id: state == 'add' ? this.systemgenerated_response_id + 1 : 0,
              cpt_code_id: result.data.cpt_code_id != undefined ? result.data.cpt_code_id : null,
              cpt_description: result.data.cpt_description != undefined ? result.data.cpt_description : null,
              cpt_code: result.data.cpt_code != undefined ? result.data.cpt_code : null
            }

            this.questionResponse.forEach((x) => {
              if (x.question_id == value.question_id && x.question_id != 0) { // new change
                x.response.push(resposne)
                this.systemgenerated_response_id = this.systemgenerated_response_id + 1
                if (result.data.ideal_choice == true && value.response_type.code !== 'MULTI') {
                  x.response.forEach(element => {

                    if (element.systemgenerated_response_id != this.systemgenerated_response_id) {
                      element.ideal_choice = false
                    }
                  });
                }
              }
              else if (x.systemgenerated_question_id == value.systemgenerated_question_id && x.systemgenerated_question_id != 0) {
                x.response.push(resposne)
                this.systemgenerated_response_id = this.systemgenerated_response_id + 1

                if (result.data.ideal_choice == true && value.response_type.code !== 'MULTI') {
                  x.response.forEach(element => {

                    if (element.systemgenerated_response_id != this.systemgenerated_response_id) {
                      element.ideal_choice = false
                    }
                  });
                }

              }

            })

            this.messageService.add({ severity: 'success', summary: 'Response Added' });
          }
          else {
            if (result.data.response_id == 0) {
              // new added response
              this.questionResponse.forEach((x) => {
                if ((x.systemgenerated_question_id == result.data.systemgenerated_question_id && x.systemgenerated_question_id != 0) || (x.question_id == result.data.question_id && x.question_id != 0)) {

                  x.response.forEach((y) => {
                    if (y.systemgenerated_response_id == result.data.systemgenerated_response_id) {
                      y.score = result.data.score,
                        y.ideal_choice = result.data.ideal_choice,
                        y.response = result.data.response
                      y.cpt_code_id = result.data.cpt_code_id != undefined ? result.data.cpt_code_id : null,
                        y.cpt_description = result.data.cpt_description != undefined ? result.data.cpt_description : null,
                        y.cpt_code = result.data.cpt_code != undefined ? result.data.cpt_code : null
                    }
                  })
                  if (result.data.ideal_choice == true && responseList.response_type.code !== 'MULTI') {
                    x.response.forEach(element => {
                      if (element.systemgenerated_response_id != result.data.systemgenerated_response_id) {
                        element.ideal_choice = false
                      }
                    });
                  }
                }
              })
              this.messageService.add({ severity: 'success', summary: 'Response Updated' });
            }
            else if (result.data.systemgenerated_response_id == 0) {
              // old response
              this.questionResponse.forEach((x) => {
                if (x.question_id == result.data.question_id) {

                  x.response.forEach((x) => {
                    if (x.response_id == result.data.response_id) {
                      x.response = result.data.response,
                        x.score = result.data.score,
                        x.ideal_choice = result.data.ideal_choice
                      x.cpt_code_id = result.data.cpt_code_id != undefined ? result.data.cpt_code_id : null,
                        x.cpt_description = result.data.cpt_description != undefined ? result.data.cpt_description : null,
                        x.cpt_code = result.data.cpt_code != undefined ? result.data.cpt_code : null
                    }
                  })

                  if (result.data.ideal_choice == true && responseList.response_type.code !== 'MULTI') {
                    x.response.forEach(element => {

                      if (element.response_id != result.data.response_id) {
                        element.ideal_choice = false
                      }
                    });
                  }
                }
              })
              this.messageService.add({ severity: 'success', summary: 'Response Updated' });
            }
          }
        }
        else {
          this.messageService.add({ severity: 'info', summary: 'Error', detail: result.errorDetail })
        }
      }
      else {
      }
    });
  }

  QuestionResponseExist() {
    var question = this.questionResponse.find(obj => (obj.response_type == "" && obj.active == true));
    if (question != undefined) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: "Please select Response type of question " + '"' + question.question + '"' })
      return false;
    }
    var questionRes = this.questionResponse.find(obj => ((obj.response_type.code === "SELECT" || obj.response_type.code === "MULTI") && obj.response.length == 0 && obj.active == true));

    if (questionRes != undefined) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: "Please add Response of question " + '"' + questionRes.question + '"' })
      return false;
    }
    else return true;

  }

  onResponseTypeChange(event, data) {
    if (data.response.length != 0 && (data.response_type.code == "DATE" || data.response_type.code == "TEXTAREA")) {
      var questionRes = this.questionResponse.find(obj => (obj.response_type.code === data.response_type.code && obj.question_id == data.question_id && obj.question == data.question));
      questionRes.response.forEach(element => {
        element.active = false;
      });
    }
    if (data.response_type.code == "SELECT") {
      var questionRes = this.questionResponse.find(obj => (obj.response_type.code === data.response_type.code && obj.question_id == data.question_id && obj.question == data.question));
      var y = questionRes.response.filter(x => x.ideal_choice === true)
      if (y.length > 1) {
        questionRes.response.filter(x => x.ideal_choice === true).forEach(element => {
          element.ideal_choice = false;

        });
      }
    }
  }

  onSubmit(value) {
    let scoreData = [];
    if (this.orderForm.invalid) {
      return;
    }

    if (this.questionResponse.length == 0) {
      this.messageService.add({ severity: 'info', summary: 'Error', detail: "Please add at least one question for Assessment" })
      return;
    }
    if (this.selectedRoles.length == 0) {
      this.messageService.add({ severity: 'info', summary: 'Error', detail: "Please add at least one Role for Assessment" })
      return;
    }
    if (this.orderForm.invalid) {
      return;
    }

    if (this.QuestionResponseExist()) {
      this.saving = true;
      this.selectedRoles.forEach(element => {
        let array_new = {
          assessment_id: this.assessment_id,
          role_id: element.id,
          mandatory: true,
          active: true, //element.disabled
        }
        scoreData.push(array_new);
      });

      if (!this.scorable) {
        this.scoreList.forEach((x) => {
          x.active = false
        })
      }
      this.questionResponse.forEach(element => {
        if (element.displayRules.length > 0) {
          element.displayRules.forEach(rule => {
            if (rule.display_type == 1) { rule.display_type = true; }
            if (rule.display_type == 0) { rule.display_type = false; }

            rule.final_mapping_array.forEach(maping => {
              if (maping.relation) { maping.relation = 1 } else { maping.relation = 0 }
            });
          })
        }
      });

      let obj = {
        assessment_id: this.assessment_id,
        assessment_name: this.orderForm.value.name,
        is_scoreable: this.scorable,
        AssessmentQuestionListData: this.questionResponse,
        assessmentContentLists: this.contentResponse,
        assessmentScoreList: this.scoreList,
        AssessmentRoles: scoreData,
        active: true
      }
      this.clinicalAssetService.addUpdateAssessment(obj).subscribe(
        (result: any) => {
          if (result.status == 200) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: result.message });
            this._router.navigate(["/admin-clinical"], { queryParams: { tab: 1 } });

          }
          else if (result.status == 404) {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: result.message })
          }
          else {
            this.messageService.add({ severity: 'info', summary: 'Error', detail: result.message })
          }
          this.saving = false;
        },
        (error) => {
          this.saving = false;
        });
    }
  }

  getMasterData() {
    this.loading = true;
    this.clinicalAssetService.getMasterDataOrderbyKey('is_clinician_role,response_type', '', 'code', 'asc').subscribe(
      (result: any) => {
        this.loading = false;
        this.masterRole3 = result.is_clinician_role;
        this.masterRole = this.masterRole3.filter(a => a.disabled == false);
        this.masterRole2 = this.masterRole3.filter(a => a.disabled == true);
        this.masterRole2.forEach(obj => {
          this.masterRole.push(obj);
        })

        let xyx = result.response_type;
        xyx.forEach(element => {
          let array_new = {
            code: element.code
          }
          this.masterResponseTypes.push(array_new);
        });

        this.questionResponse.forEach((x) => {
          var ques_response = this.masterResponseTypes.filter((z => z.code == x.response_type));
          if (ques_response != null) {
            x.response_type = {
              "code": ques_response[0].code
            }
          }
        })

        if (this.assessment_id != 0) {
          var roles = this.roles.map(s => s.role_id)
          if (roles) {
            var arr = this.masterRole.filter(item => roles.indexOf(item.id) !== -1);
            if (arr.length > 0)
              this.selectedRoles = arr
          }
        }
      },
      (error) => {
        this.loading = false;
      });
  }

  addScore(value) {
    this.ref = this.dialogService.open(AddScoreModalComponent, {
      header: value == 0 ? 'Create Score ' : 'Edit Score',
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { question: value },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data) {
          if (result.data.saved_score_id == 0 && result.data.systemgenerated_score_id == 0) {
            let scoreObj = {
              active: true,
              assessment_id: this.assessment_id,
              code: result.data.code,
              code_type: "ICD-10",
              score_max: result.data.score_max,
              score_min: result.data.score_min,
              saved_score_id: 0,
              systemgenerated_score_id: this.systemgenerated_score_id + 1,
              description: result.data.description
            }
            this.systemgenerated_score_id = this.systemgenerated_score_id + 1
            this.scoreList.push(scoreObj);
          }
          else if (result.data.saved_score_id == 0) {
            this.scoreList.forEach((x) => {
              if (x.systemgenerated_score_id == result.data.systemgenerated_score_id) {
                x.score_max = result.data.score_max,
                  x.score_min = result.data.score_min,
                  x.code = result.data.code,
                  x.description = result.data.description

              }
            })
          }
          else if (result.data.systemgenerated_score_id == 0) {
            this.scoreList.forEach((x) => {
              if (x.saved_score_id == result.data.saved_score_id) {
                x.score_max = result.data.score_max,
                  x.score_min = result.data.score_min,
                  x.code = result.data.code,
                  x.description = result.data.description

              }
            })
          }

        }

      }

    });
  }


  deleteQuestion(item) {
    this.confirmationService.confirm({
      message:
        'Are you sure to change the status of this Question?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        if (item.question_id == 0) {
          this.questionResponse = this.questionResponse.filter(e => e.systemgenerated_question_id !== item.systemgenerated_question_id)
        }
        else if (item.systemgenerated_question_id == 0) {
          this.questionResponse.forEach((x) => {
            if (x.question_id == item.question_id) {
              if (x.response != null && x.response.length > 0) {
                if (item.active == true) {
                  x.active = false;
                }
                else {
                  x.active = true;
                }

              }
              else {
                if (item.active == true) {
                  x.active = false
                }
                else {
                  x.active = true
                }
              }
            }
          })

        }

        this.isunsaved = true;
        this.confirmationService.close();

      },
    });
  }

  deleteContent(item) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Content?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-danger',
      reject: () => {
        // Action to be taken on reject (e.g., cancel)
        this.confirmationService.close();
      },
      accept: () => {
        this.performDeletion(item);
        this.isunsaved = true;
        this.confirmationService.close();
      },
    });
  }

  private performDeletion(item): void {
    if (item.contentBlock_id == 0) {
      this.contentResponse = this.contentResponse.filter(e => e.systemgenerated_contentBlock_id !== item.systemgenerated_contentBlock_id);
    } else if (item.systemgenerated_contentBlock_id == 0) {
      this.contentResponse.forEach((x) => {
        if (x.contentBlock_id == item.contentBlock_id) {
          x.active = false;
        }
        this.contentResponse = this.contentResponse.filter(e => e.active !== item.active);
      });
    }
    this.cdr.detectChanges();
  }

  deleteResponse(item) {
    this.confirmationService.confirm({
      message:
        'Are you sure to change the status of this Response?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        if (item.question_id == 0) {
          this.questionResponse.forEach((x) => {
            if (x.systemgenerated_question_id == item.systemgenerated_question_id) {

              x.response = x.response.filter(y => y.systemgenerated_response_id !== item.systemgenerated_response_id)
            }
          });
        }
        else if (item.systemgenerated_question_id == 0) {
          // old question
          if (item.systemgenerated_response_id == 0) {  // old response
            this.questionResponse.forEach((x) => {
              if (x.question_id == item.question_id) {
                x.response.forEach(element => {
                  if (element.response_id == item.response_id) {
                    if (item.active == true) {
                      element.active = false;
                    }
                    else {
                      element.active = true;
                    }

                  }
                });
              }
            })
          }
          else if (item.response_id == 0) {
            // new response systemgenerated_response_id 
            this.questionResponse.forEach((x) => {

              x.response = x.response.filter(y => y.systemgenerated_response_id !== item.systemgenerated_response_id)

            })
          }
          else {

          }
        }

        this.isunsaved = true;
        this.confirmationService.close();
      },
    });
  }

  scroableSelection(event) {
    if (event.checked)
      this.scorable = true;
    else {
      this.scorable = false;
    }
  }

  deleteScore(obj) {
    this.confirmationService.confirm({
      message:
        'Are you sure you wish to delete this Score?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        var y = this.scoreList;
        this.scoreList.find(o => (o.code === obj.code && o.code_type == obj.code_type && o.assessment_id == obj.assessment_id && o.systemgenerated_score_id == obj.systemgenerated_score_id)).active = false;
        var index = this.scoreList.findIndex(p => p.systemgenerated_score_id > 0 && p.active == false);
        if (index > -1) {
          this.scoreList.splice(index, 1)
        }
        this.confirmationService.close();
      },
    });
  }

  listStyle = {
    dropZoneHeight: '50px'
  }

  openConditionalQuestionModal(value) {
    let sendQuestion;
    if (value.question_id != 0) { sendQuestion = this.questionResponse.filter(x => x.question_id != value.question_id); }
    else { sendQuestion = this.questionResponse.filter(x => x.systemgenerated_question_id != value.systemgenerated_question_id); }

    this.ref = this.dialogService.open(AddConditionalQuestionModalComponent, {
      header: value.displayRules.length == 0
        ? 'Add Display Rules' : 'Edit Display Rules',
      width: '800px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: {
        current_question_id: value.question_id, assessment_id: value.assessment_id,
        questionModel: sendQuestion, selectedDisplayRules: value.displayRules,
        current_question_systemgenerated_id: value.systemgenerated_question_id
      },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        this.questionResponse.forEach((x) => {
          if (x.question_id != 0) {
            if (x.question_id == value.question_id) {
              x.displayRules = result.data;
            }
          } else {
            if (x.systemgenerated_question_id == value.systemgenerated_question_id) {
              x.displayRules = result.data;
            }
          }
        })
        this.messageService.add({ severity: 'success', summary: 'Display Rules Updated' });
        this.isunsaved = true;
      }
    });
  }

  dropdaragResponse(event: CdkDragDrop<string[]>, question_id: any) {
    const obj = (this.questionResponse || []).filter(x => question_id == x.question_id)[0];

    if (!(obj && obj.response && obj.response.length > 0))
      return;

    moveItemInArray(obj.response, event.previousIndex, event.currentIndex);

    obj.response
      .forEach((x, idx) => {
        x.sort_order = idx + 1;
      });
  }

  dropdragQuestion(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.questionResponse, event.previousIndex, event.currentIndex);
    this.questionResponse
      .forEach((x, idx) => {
        x.sort_order = idx + 1;
      });
  }

  dragdropContent(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.contentResponse, event.previousIndex, event.currentIndex);
    this.contentResponse
      .forEach((x, idx) => {
        x.sort_order = idx + 1;
      });
  }

  back() {
    this._router.navigate(['/admin-clinical'], { queryParams: { tab: 1 } });
  }
}
