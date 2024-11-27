import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarePlanTemplateDetailsComponent } from './care-plan-templates/care-plan-template-details/care-plan-template-details.component';
import { ClinicalAssetsComponent } from './clinical-assets.component';
import { ViewDatagridComponent } from './dynamic-data-grids/view-datagrid/view-datagrid.component';
import { MasterAssessmentComponent } from './master-assessment/master-assessment.component';
import { NewAssessmentComponent } from './new-assessment/new-assessment.component';
const routes: Routes = [
  {
    path: '',
    component: ClinicalAssetsComponent,
    children: [
      {
        path: 'new-assessment',
        component: NewAssessmentComponent
      },
      {
        path:'care-plan-template-details',
        component : CarePlanTemplateDetailsComponent
      },
      {
        path: '',
        component: MasterAssessmentComponent
      },
      {
        path: 'view-datagrid',
        component: ViewDatagridComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicalAssetsRoutingModule { }
