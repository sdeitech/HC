import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProviderScheduleService } from 'src/app/services/provider';
import { ClinicalAssetService } from '../../services/clinical-asset.service';

@Component({
  selector: 'app-add-new-care-plan-template-details',
  templateUrl: './add-new-care-plan-template-details.component.html',
  styleUrls: ['./add-new-care-plan-template-details.component.scss']
})
export class AddNewCarePlanTemplateDetailsComponent implements OnInit {

  createProblemForm: any;
  cp_type: any;
  statusList: {}[];
  loading: boolean = false;
  careTemplateId: any;
  careplanpgbilist: any;
  selectedProblem: any
  masterProblem: any;
  problemlabel: any;
  masterdata: any;
  diag: [];
  assetslist: any[];
  selectedkey: any;
  barrier: any;
  constructor(
    public ref: DynamicDialogRef,
    private _fb: FormBuilder,
    public config: DynamicDialogConfig,
    private _carePlanService: ProviderScheduleService,
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService
  ) {
    this.statusList = [{ id: true, name: 'Yes' }, { id: false, name: 'No' }]
    this.careTemplateId = config.data.templateData;
    this.cp_type = config.data.cp_type;
    this.problemlabel = config.data.cp_type.charAt(0).toUpperCase() + config.data.cp_type.substr(1).toLowerCase()
    config.header;
  }

  ngOnInit(): void {
    this.createProblemForm = this._fb.group({
      id: [],
      problem: ['', [Validators.required]],
      diag_id: [],

    });
    this.getMasterData();
  }
  filteredProblemPlan: any = [];
  filteredProblemId: any;

  getlistpgib(event, type) {
    const model = {
      searchType: type,
      searchText: event.query

    }
    var data = this.createProblemForm.getRawValue();
    if (this.cp_type == 'barrier') {
      this.careplanpgbilist = this.barrier
    }
    else {
      this._carePlanService.getListByDiagId(data.diag_id, this.cp_type).subscribe((result: any) => {
        this.loading = false;
        this.careplanpgbilist = result;


        // this.careplandetailsProblemslist = this.careplandetailsAlllist.filter(x => x.cp_type == 'problem')
        // this.totalRecordps = this.careplandetailsProblemslist.length;
        // this.careplandetailsGoalslist = this.careplandetailsAlllist.filter(x => x.cp_type == 'goal')
        // this.careplandetailsInterventionslist = this.careplandetailsAlllist.filter(x => x.cp_type == 'intervention')
        // this.careplandetailsBarrierslist = this.careplandetailsAlllist.filter(x => x.cp_type == 'barrier')
      },
      );
    }
    this.filterdata(event);
  }

  getMasterData() {
    this._carePlanService.getMasterData('diag,barrier', '').subscribe((result: any) => {
      this.masterdata = result;
      this.diag = result.diag;
      this.barrier = result.barrier;
      if (this.cp_type == 'barrier') {
        this.assetslist = [];
        this.assetslist = this.barrier
      }
    }, error => {
    });
  }

  getProblems(event: any) {
    var data = this.createProblemForm.getRawValue();
    this._carePlanService.getListByDiagId(data.diag_id, this.cp_type).subscribe((result: any) => {
      this.assetslist = [];
      this.assetslist = result;
    }, error => {
    });

  }
  filterdata(event) {
    let filtered: any[] = [];
    let filteredId: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.careplanpgbilist.length; i++) {
      let name = this.careplanpgbilist[i].code;
      if (name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(name);
        this.filteredProblemId = this.careplanpgbilist[i].id;
      }

      this.filteredProblemPlan = filtered;
      this.filteredProblemId = filteredId;
    }
  }

  onSubmit(formData: any) {

    formData.problem = this.assetslist.filter(x => x.id == this.selectedProblem)

    if (!this.createProblemForm.valid || formData.problem.length == 0)
      return;
    this.loading = true;

    const obj = {
      id: 0,
      active: true,
      care_plan_id: this.careTemplateId,
      cp_type: this.cp_type,
      diag_id: formData.diag_id,
      description: formData.problem[0].code

    }
    this.clinicalAssetService.addUpdateCarePlanTemplateDeatils(obj).subscribe(
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

}
