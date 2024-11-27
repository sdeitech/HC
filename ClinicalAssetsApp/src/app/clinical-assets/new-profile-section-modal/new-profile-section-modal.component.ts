import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SchedulerService } from '../../scheduler/services/scheduler.service';
import { UsersRoleService } from '../../users-and-roles/services/users-role.service';
import { CreateSectionReqModel } from '../model/create-req-section-model';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { ProviderScheduleService } from '../../provider/services/provider-schedule.service';
import { ApiResponse } from 'src/app/models/api-response';

@Component({
  selector: 'app-new-profile-section-modal',
  templateUrl: './new-profile-section-modal.component.html',
  styleUrls: ['./new-profile-section-modal.component.scss']
})
export class NewProfileSectionModalComponent implements OnInit {
  projectList: any[]; projectList2: any[];
  assessmentList: any[]; assessmentList2: any = [];
  datagridList: any[]; datagridList2: any = [];
  dg_datagridList: any[]; dg_datagridList2: any = [];
  statusList: any[];
  createSectionForm: FormGroup;
  selectedStatus: any = {}
  selectedAssessment: any[] = [];
  selectedDataGrid: any[] = [];
  selectedDgDataGrid: any[] = [];
  selectedProject: any;
  loading: boolean = false;
  section_id: any;
  selectedAppointmentType: any[] = [];
  appointmentTypeList: any[];
  appointmentDetailsList: any[];
  typingTimer;
  doneTypingInterval = 500;
  projectDetails_list: any[];
  require_section: boolean = true;
  associated_project: boolean = false;
  associated_appointmentType: boolean = false;
  associated_appointmentDetails: boolean = false;
  selectedAssociatedProject: any;
  selectedAssociatedAppointmentType: any[] = [];
  selectedAssociatedAppointmentDetails: any[] = [];
  isProjectDisabled: boolean = false;
  isApptTypeDisabled: boolean = false;
  isApptDetailDisabled: boolean = false;


  constructor(
    private adminService: UsersRoleService,
    private clinicalAssetService: ClinicalAssetService,
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    public messageService: MessageService,
    private _schedulerService: SchedulerService,
    private _providerScheduleService: ProviderScheduleService
  ) {
    this.statusList = [
      { id: true, name: 'Active' },
      { id: false, name: 'Disabled' },
    ];
    this.getAssessmentDatagridSection();
  }

  ngOnInit(): void {
    this.createForm();
    this.getAppointmentType();
    this.getAppointmentDetails();
  }

  createForm() {
    this.createSectionForm = this.fb.group({
      id: [this.config.data.editSection.id, ''],
      status: [true, ''],
      sectionname: ['', Validators.required],
      assessment: ['', ''],
      datagrid: ['', ''],
      dg_datagrid: ['', ''],
      project: ['', ''],
      appointmenttype: ['', Validators.required],
      require_section: [true, ''],
      associated_project: [false, ''],
      associated_appointmentType: [false, ''],
      associated_appointmentDetails: [false, ''],
      associated_project_id: ['', ''],
      associated_appointmentType_id: ['', ''],
      associated_appointmentDetails_id: ['', '']
    });
  }

  bindFormValue(value) {
    this.createSectionForm.controls['status'].setValue(value.active);
    this.createSectionForm.controls['sectionname'].setValue(value.name);
    this.selectedStatus = this.statusList.filter(x => x.id == value.active)
    if (value.assessment_id) {
      let filteredAssment = [];
      let filteredAssessment = value.assessment_id.split(",");
      filteredAssessment.forEach(element => {
        this.assessmentList.forEach(list => {
          if (list.id == element) {
            let obj12 = [{
              id: list.id,
              name: list.name,
              active: list.active
            }]
            filteredAssment.push(...obj12)
          }
        });
      });
      this.selectedAssessment = filteredAssment;
    }
    if (value.datagrid_id) {
      let filterElements = []
      let filteredDataGrid = value.datagrid_id.split(",");
      filteredDataGrid.forEach(element => {
        this.datagridList.forEach(list => {
          if (list.id == element) {
            let obj12 = [{
              id: list.id,
              name: list.name,
              active: list.active
            }]
            filterElements.push(...obj12)
          }
        });
      });
      this.selectedDataGrid = filterElements;
    }
    if (value.dg_datagrid_id) {
      let filterElements = []
      let filteredDataGrid = value.dg_datagrid_id.split(",");
      filteredDataGrid.forEach(element => {
        this.dg_datagridList.forEach(list => {
          if (list.id == element) {
            let obj12 = [{
              id: list.id,
              name: list.name,
              active: list.active
            }]
            filterElements.push(...obj12)
          }
        });
      });
      this.selectedDgDataGrid = filterElements;
    }

    var lstSelectedProject = [];
    var allProjects = this.projectList;
    if (value.project_id) {
      let filteredProject = value.project_id.split(",");
      filteredProject.forEach(element => {
        let obj = [];
        obj = this.projectList.filter(
          list => list.id === parseInt(element)
        );
        lstSelectedProject.push(...obj);
      });
    }
    var selectedProjectId = value.project_id ? value.project_id.split(',').map(Number) : 0;
    let lstSelectedProjectIdName = this.GetSelectedProjectIdName(lstSelectedProject, selectedProjectId);
    let projectDetailsWithSelectionFlag = allProjects.map(project => {
      return {
        ...project,
        name: project.code,
        isSelected: lstSelectedProjectIdName.some(selectedProject => selectedProject.id === project.id)
      };
    });
    this.projectDetails_list = projectDetailsWithSelectionFlag;
    this.selectedProject = lstSelectedProjectIdName.map(x => x.id);

    if (value.appointment_type_id) {
      let filterElements = [];
      let filteredAppointmenttype = value.appointment_type_id.split(",");
      filteredAppointmenttype.forEach(element => {
        this.appointmentTypeList.forEach(list => {
          if (list.id == element) {
            let obj12 = [{
              id: list.id,
              name: list.name,
              code_key: list.code_key
            }]
            filterElements.push(...obj12)
          }
        });
        this.selectedAppointmentType = filterElements;
      });
    }
    this.createSectionForm.controls["require_section"].setValue(value.require_section);
    this.createSectionForm.controls["associated_project"].setValue(value.associated_project);
    this.createSectionForm.controls["associated_appointmentType"].setValue(value.associated_appointmentType);
    this.createSectionForm.controls["associated_appointmentDetails"].setValue(value.associated_appointmentDetails);
    value.associated_project ? (this.isProjectDisabled = true) : (this.isProjectDisabled = false);
    value.associated_appointmentType ? (this.isApptTypeDisabled = true) : (this.isApptTypeDisabled = false);
    value.associated_appointmentDetails ? (this.isApptDetailDisabled = true) : (this.isApptDetailDisabled = false);
    if (value.associated_project_id != null) {
      this.selectedAssociatedProject = value.associated_project_id.split(',').map(Number);
    }
    if (value.associated_appointmentType_id != null) {
      this.selectedAssociatedAppointmentType = value.associated_appointmentType_id.split(',').map(Number);
    }
    if (value.associated_appointmentDetails_id != null) {
      this.selectedAssociatedAppointmentDetails = value.associated_appointmentDetails_id.split(',').map(Number);
    }
  }

  getMasterData() {
    this.adminService.getMasterDatawithCodeKeySorting('masterproject', '', 'code', 'asc').subscribe(
      (result: any) => {
        this.projectList = result.masterproject.filter(a => !a.disabled);
        const disabledProjects = result.masterproject.filter(a => a.disabled);
        this.projectList.push(...disabledProjects);
        this.projectDetails_list = this.projectList.map(project => ({
          ...project,
          name: project.code
        }));

        if (this.config.data.editSection) {
          this.bindFormValue(this.config.data.editSection);
          this.createSectionForm.controls['id'].setValue(this.config.data.editSection.id);
          this.section_id = this.config.data.editSection.id;
        }
      },
      (error) => { }
    );
  }

  getAssessmentDatagridSection() {
    this.clinicalAssetService.getAssessmentDatagrid().subscribe(
      (result: any) => {
        this.assessmentList = result.body.assessment.filter(a => a.active == true);
        this.assessmentList2 = result.body.assessment.filter(a => a.active == false);
        this.assessmentList2.forEach(obj => {
          this.assessmentList.push(obj);
        })

        this.datagridList = result.body.datagrid.filter(a => a.active == true);
        this.dg_datagridList = result.body.dg_datagrid.filter(a => a.active == true);
        this.datagridList2 = result.body.datagrid.filter(a => a.active == false);
        this.dg_datagridList2 = result.body.dg_datagrid.filter(a => a.active == false);
        this.datagridList2.forEach(obj => {
          this.datagridList.push(obj);
        });
        this.dg_datagridList2.forEach(obj => {
          this.dg_datagridList.push(obj);
        });
        this.getMasterData();
      },
      (error) => { }
    );
  }
  showProjectReqError: boolean = false;
  onSubmit(sectionForm: CreateSectionReqModel) {
    if (this.createSectionForm.invalid || this.selectedProject.length == 0) {
      if (this.selectedProject.length == 0) {
        this.showProjectReqError = true;
      }
      return;
    }
    if (sectionForm.id == null)
      sectionForm.status = true;
    var assessment = this.selectedAssessment.map(s => s.id)
    var datagrid = this.selectedDataGrid.map(s => s.id)
    var dg_datagrid = this.selectedDgDataGrid.map(s => s.id)
    var appointmenttype = this.selectedAppointmentType.map(s => s.id);

    if (this.selectedAssociatedProject != undefined) {
      var asso_project = this.selectedAssociatedProject.map(s => s);
      sectionForm.associated_project_id = asso_project.toString();
    } else {
      sectionForm.associated_project_id = '';
    }
    if (this.selectedAssociatedAppointmentType != undefined) {
      var asso_appointmentType = this.selectedAssociatedAppointmentType.map(s => s);
      sectionForm.associated_appointmentType_id = asso_appointmentType.toString();
    } else {
      sectionForm.associated_appointmentType_id = '';
    }
    if (this.selectedAssociatedAppointmentDetails != undefined) {
      var asso_appointmentDetails = this.selectedAssociatedAppointmentDetails.map(s => s);
      sectionForm.associated_appointmentDetails_id = asso_appointmentDetails.toString();
    } else {
      sectionForm.associated_appointmentDetails_id = '';
    }

    sectionForm.assessment = assessment.toString();
    sectionForm.datagrid = datagrid.toString();
    sectionForm.dg_datagrid = dg_datagrid.toString();
    sectionForm.project = this.selectedProject ? this.selectedProject.toString() : '';
    sectionForm.appointmenttype = appointmenttype.toString();

    sectionForm.require_section = this.require_section;

    sectionForm.associated_project = this.associated_project;
    sectionForm.associated_appointmentType = this.associated_appointmentType;
    sectionForm.associated_appointmentDetails = this.associated_appointmentDetails;

    this.loading = true;
    this.clinicalAssetService.createSection(sectionForm).subscribe((result: any) => {
      this.loading = false;
      if (result.status == 200) {
        this.ref.close({ data: result });
      }
      else {
        this.messageService.add({ severity: 'info', summary: 'Error', detail: result.errorDetail })
      }
    })
  }

  getAppointmentType() {
    this._schedulerService.getAppointmentType().subscribe((result: any) => {
      if (result != null) {
        this.appointmentTypeList = result;
      }
    })
  }

  getAppointmentDetails() {
    this.clinicalAssetService.getAppointmentDetails().subscribe((result: any) => {
      if (result != null) {
        this.appointmentDetailsList = result;
      }
    })
  }

  //#region Search User Project Name
  SearchProjectName(event: any) {
    let searchKeyword = event.filter.trim();
    if (searchKeyword.length > 2) {
      clearTimeout(this.typingTimer)
      this.typingTimer = setTimeout(() => {
        this.GetUserProjectName(searchKeyword)
      }, this.doneTypingInterval);
    }

    if (searchKeyword == "" || searchKeyword.length < 2) {
      this.projectDetails_list = null;
    }
  }

  GetUserProjectName(projectName: string) {
    this.projectDetails_list = [];

    let reqModel = {
      projectName: projectName
    };

    this._providerScheduleService.SearchUserProjectName(reqModel).subscribe((res: ApiResponse) => {

      if (res.status) {
        if (res.data != null && res.data.length > 0) {
          this.projectDetails_list = res.data;
        }
      }
    });

  }

  GetSelectedProjectIdName(lstSelectedProject: any, selectedProjectId: any): any {
    var arrProjectIdName = [];
    if (lstSelectedProject.length > 0 && selectedProjectId.length > 0)
      for (let i = 0; i < lstSelectedProject.length; i++) {
        for (let j = 0; j < selectedProjectId.length; j++) {
          if (lstSelectedProject[i].id == selectedProjectId[j]) {
            arrProjectIdName.push({ id: lstSelectedProject[i].id, name: lstSelectedProject[i].code });
          }
        }
      }
    else {
      arrProjectIdName = [];
    }
    return arrProjectIdName;
  }

  projectSelection(event) {
    if (event.checked)
      this.isProjectDisabled = true
    else {
      this.isProjectDisabled = false
      this.createSectionForm.controls['associated_project_id'].setValue(null);
    }
    this.associated_project = event.checked;
  }

  apptTypeSelection(event) {
    if (event.checked)
      this.isApptTypeDisabled = true
    else {
      this.isApptTypeDisabled = false
      this.createSectionForm.controls['associated_appointmentType_id'].setValue(null);
    }
    this.associated_appointmentType = event.checked;
  }

  apptDetailSelection(event) {
    if (event.checked)
      this.isApptDetailDisabled = true
    else {
      this.isApptDetailDisabled = false
      this.createSectionForm.controls['associated_appointmentDetails_id'].setValue(null);
    }
    this.associated_appointmentDetails = event.checked;
  }

  onRemove() {
    this.getMasterData();
  }

  onProjectChange() {
    if (this.selectedProject.length == 0) {
      this.showProjectReqError = true;
    } else {
      this.showProjectReqError = false;
    }
  }

}
