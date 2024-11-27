import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataSharingService } from '../services/datasharing.service';

@Component({
  selector: 'app-add-content-block-modal',
  templateUrl: './add-content-block-modal.component.html',
  styleUrls: ['./add-content-block-modal.component.scss']
})
export class AddContentBlockModalComponent implements OnInit {
  addContentForm: FormGroup;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public messageService: MessageService,
    private datasharingService: DataSharingService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.addContentForm = this.fb.group({
      content_block: ['', Validators.required],
      systemgenerated_contentBlock_id: [0, '',],
      contentBlock_id: [0, ''],
      assessment_id: ['', '']
    });

    if (this.config.data.contentModel != 0) {
      const contentModel = this.config.data.contentModel;
      this.addContentForm.patchValue({
        content_block: contentModel.content_block,
        systemgenerated_contentBlock_id: contentModel.systemgenerated_contentBlock_id,
        contentBlock_id: contentModel.contentBlock_id,
        assessment_id: contentModel.assessment_id
      });
    }
  }
  contentExist(name) {
    return this.config.data.allContent.some(function (el) {
      return el.content_block === name;
    });
  }

  editContentExist(name, systemId, id) {
    return this.config.data.allContent.some(function (el) {
      return el.content_block === name && el.systemgenerated_contentBlock_id != systemId && el.contentBlock_id != id;
    });
  }

  newContentExist(name, systemId, id) {
    var response = this.config.data.allContent.find(obj => obj.content_block === name);
    if (response != undefined) {
      if (response.contentBlock_id == id) {
        return false;
      }
      else
        return true;
    }
    else return false;
  }

  onSubmit(value) {
    this.loading = true;
    if (this.addContentForm.invalid) {
      this.loading = false;
      return;
    }
    const obj = this.addContentForm.value;
    var y = this.config.data.allContent;
    if (this.config.data.contentModel == 0) {
      if (this.contentExist(obj.content_block)) {
        this.messageService.add({ severity: 'info', summary: 'Content already exist' });
        this.loading = false;
        return;
      }
    }
    else {
      if (value.systemgenerated_contentBlock_id == 0) {
        if (this.newContentExist(obj.content_block, obj.systemgenerated_contentBlock_id, obj.contentBlock_id)) {
          this.messageService.add({ severity: 'info', summary: 'Content already exist' });
          this.loading = false;
          return;
        }
      }
      else {
        if (this.editContentExist(obj.content_block, obj.systemgenerated_contentBlock_id, obj.contentBlock_id)) {
          this.messageService.add({ severity: 'info', summary: 'Content already exist' });
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
