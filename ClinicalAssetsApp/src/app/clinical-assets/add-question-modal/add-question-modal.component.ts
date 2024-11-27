import { Component, DEFAULT_CURRENCY_CODE, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataSharingService } from '../services/datasharing.service';

@Component({
  selector: 'app-add-question-modal',
  templateUrl: './add-question-modal.component.html',
  styleUrls: ['./add-question-modal.component.scss']
})
export class AddQuestionModalComponent implements OnInit {
  addQuestionForm: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public messageService: MessageService,
    private datasharingService:DataSharingService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.addQuestionForm = this.fb.group({
      question: ['', Validators.required],
      systemgenerated_question_id: [0, '',],
      question_id: [0, ''],
      assessment_id: ['', '']
    });

    if (this.config.data.questionModel != 0) {
      this.addQuestionForm.get('question').setValue(this.config.data.questionModel.question)
      this.addQuestionForm.get('systemgenerated_question_id').setValue(this.config.data.questionModel.systemgenerated_question_id)
      this.addQuestionForm.get('question_id').setValue(this.config.data.questionModel.question_id)
      this.addQuestionForm.get('assessment_id').setValue(this.config.data.questionModel.assessment_id)
    }
  }
  questionExists(name) {
    return this.config.data.allQuestions.some(function(el) {
      return el.question === name  ;
    }); 
  }

  editQuestionExists(name,systemId,id) {
    return this.config.data.allQuestions.some(function(el) {
        return el.question === name && el.systemgenerated_question_id != systemId && el.question_id != id ;
    });  
  }

  newQuestionExist(name,systemId,id)
    {
      var response=  this.config.data.allQuestions.find(obj => obj.question === name);
      if(response != undefined)
      {
        if(response.question_id == id)
        {
          return false;
        }
        else
        return true;
      }
      else return false;
      
    }
  onSubmit(value) {
    this.loading = true;
    if (this.addQuestionForm.invalid){
      this.loading = false;
      return;
    }
  
    
    let obj ={
      question:value.question.trim(),
      assessment_id: value.assessment_id,
      question_id: value.question_id,
      systemgenerated_question_id: value.systemgenerated_question_id
    }
    var y= this.config.data.allQuestions;
    if (this.config.data.questionModel == 0) 
    {
      if(this.questionExists(obj.question))
      {
        this.messageService.add({ severity: 'info', summary: 'Question already exist' });
        this.loading = false;
        return;
      }
      }
      else
      {
        if(value.systemgenerated_question_id == 0)
        {
          if(this.newQuestionExist(obj.question,obj.systemgenerated_question_id,obj.question_id))
          {
            this.messageService.add({ severity: 'info', summary: 'Question already exist' });
            this.loading = false;
            return;
          }
        }
        else
        {
          if(this.editQuestionExists(obj.question,obj.systemgenerated_question_id,obj.question_id))
            {
              this.messageService.add({ severity: 'info', summary: 'Question already exist' });
              this.loading = false;
              return;
            }
          }
      }
      this.loading = false;
      this.datasharingService.isUnsaved.next(true);
    this.ref.close({ data: obj });
  }
}
