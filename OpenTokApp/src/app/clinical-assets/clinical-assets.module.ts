import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ClinicalAssetsRoutingModule } from './clinical-assets-routing.module';
import { ClinicalAssetsComponent } from './clinical-assets.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { NewProfileSectionModalComponent } from './new-profile-section-modal/new-profile-section-modal.component';
import { NewTemplateModalComponent } from './coding-guidline/new-template-modal/new-template-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgDragDropModule } from 'ng-drag-drop';
import { NgxSortableModule } from 'ngx-sortable';
import { CodingGuidlineComponent } from './coding-guidline/coding-guidline.component';
import { EditorModule } from 'primeng/editor';
import { ClinicalAssessmentComponent } from './clinical-assessment/clinical-assessment.component';
import { MasterAssessmentComponent } from './master-assessment/master-assessment.component';
import { NewAssessmentComponent } from './new-assessment/new-assessment.component';
import { DataGridModalComponent } from './data-grids/data-grids-modal/data-grids-modal.component';
import { DataGridComponent } from './data-grids/data-grids.component';
import { AddQuestionModalComponent } from './add-question-modal/add-question-modal.component';
import { AddResponseModalComponent } from './add-response-modal/add-response-modal.component';
import { AddScoreModalComponent } from './add-score-modal/add-score-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CarePlanAssetsComponent } from './care-plan-assets/care-plan-assets.component';
import { CareplanDiagnosisComponent } from './careplan-diagnosis/careplan-diagnosis.component';
import { CareplanProblemsComponent } from './careplan-problems/careplan-problems.component';
import { CareplanGoalsComponent } from './careplan-goals/careplan-goals.component';
import { CareplanInterventionsComponent } from './careplan-interventions/careplan-interventions.component';
import { CareplanBarriersComponent } from './careplan-barriers/careplan-barriers.component';
import { AddNewCareplanAssetsComponent } from './add-new-careplan-assets/add-new-careplan-assets.component';
import { DialogModule } from 'primeng/dialog';
import { CustomerService } from '../provider/services/customer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddConditionalQuestionModalComponent } from './add-conditional-question-modal/add-conditional-question-modal.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DataSharingService } from './services/datasharing.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicDataGridsComponent } from './dynamic-data-grids/dynamic-data-grids.component';
import { DynamicDataGridModalComponent } from './dynamic-data-grids/dynamic-data-grid-modal/dynamic-data-grid-modal.component';
import { ViewDatagridComponent } from './dynamic-data-grids/view-datagrid/view-datagrid.component';
import { NewFieldModalComponent } from './dynamic-data-grids/new-field-modal/new-field-modal.component';
import { DeleteFieldModalComponent } from './dynamic-data-grids/modals/delete-field-modal/delete-field-modal.component';
import { SuspectFieldModalComponent } from './dynamic-data-grids/modals/suspect-field-modal/suspect-field-modal.component';
import { ResponseFieldModalComponent } from './dynamic-data-grids/modals/response-field-modal/response-field-modal.component';
import { CarePlanTemplatesComponent } from './care-plan-templates/care-plan-templates.component';
import { CarePlanTemplatesModalComponent } from './care-plan-templates/care-plan-templates-modal/care-plan-templates-modal.component';
import { CarePlanTemplateDetailsComponent } from './care-plan-templates/care-plan-template-details/care-plan-template-details.component';
import { AddNewCarePlanTemplateDetailsComponent } from './care-plan-templates/add-new-care-plan-template-details/add-new-care-plan-template-details.component';
import { CptGenModalComponent } from './dynamic-data-grids/modals/cpt-gen-modal/cpt-gen-modal.component';
import { CareplanIdentifiedMemberRisksComponent } from './careplan-identified-member-risks/careplan-identified-member-risks.component';
import { CareplanGeneralCommentsComponent } from './careplan-general-comments/careplan-general-comments.component';
import { AddContentBlockModalComponent } from './add-content-block-modal/add-content-block-modal.component';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  declarations: [
    ClinicalAssetsComponent,
    NewProfileSectionModalComponent,
    NewAssessmentComponent,
    NewTemplateModalComponent,
    CodingGuidlineComponent,
    ClinicalAssessmentComponent,
    MasterAssessmentComponent,
    DataGridComponent,
    DataGridModalComponent,
    AddQuestionModalComponent,
    AddResponseModalComponent,
    AddScoreModalComponent,
    CarePlanAssetsComponent,
    CareplanDiagnosisComponent,
    CareplanProblemsComponent,
    CareplanGoalsComponent,
    CareplanInterventionsComponent,
    CareplanBarriersComponent,
    AddNewCareplanAssetsComponent,
    AddConditionalQuestionModalComponent,
    DynamicDataGridsComponent,
    DynamicDataGridModalComponent,
    ViewDatagridComponent,
    NewFieldModalComponent,
    DeleteFieldModalComponent,
    SuspectFieldModalComponent,
    ResponseFieldModalComponent,
    CarePlanTemplatesComponent,
    CarePlanTemplatesModalComponent,
    CarePlanTemplateDetailsComponent,
    AddNewCarePlanTemplateDetailsComponent,
    CptGenModalComponent,
    CareplanIdentifiedMemberRisksComponent,
    CareplanGeneralCommentsComponent,
    AddContentBlockModalComponent,
  ],
  imports: [
    CommonModule,
    ClinicalAssetsRoutingModule,
    NgbModule,
    DashboardModule,
    MultiSelectModule,
    AccordionModule,
    TableModule,
    InputTextModule,
    CheckboxModule,
    DragDropModule,
    DropdownModule,
    RadioButtonModule,
    ProgressBarModule,
    CalendarModule,
    PaginatorModule,
    EditorModule,
    TabViewModule,
    DynamicDialogModule,
    FileUploadModule,
    ToastModule,
    ScrollPanelModule,
    FormsModule,
    ReactiveFormsModule,
    NgDragDropModule.forRoot(),
    NgxSortableModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    DialogModule,
    ProgressSpinnerModule,
    TooltipModule,
    InputSwitchModule
  ],
  providers: [
    CustomerService,
    DialogService,
    DataSharingService,
    MessageService,
    DatePipe,
    DynamicDialogConfig,
    DynamicDialogRef,
    ConfirmationService
  ],
})
export class ClinicalAssetsModule { }
