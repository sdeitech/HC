import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClinicalAssetService } from '../../services/clinical-asset.service';
import { AddNewCarePlanTemplateDetailsComponent } from '../add-new-care-plan-template-details/add-new-care-plan-template-details.component';
import { CommonService } from 'src/app/services/common/common.service';
import { ProviderScheduleService } from 'src/app/features/provider/services/provider-schedule.service';
import { CPBarrier, CPGoal, CPIntervention, CPProblem, ChangePriority, LinkedCarePlanBuilderItemSave, LinkgoalListModel, LinkinterventionListModel, LinkproblemlistModel, LinkproblemlistModelNew, SaveCarePlanTemplateDetails, UnlinkedCarePlanBuilderItemSave, problemList, unlinkgoal, unlinkgoalModel } from 'src/app/features/provider/models/care-plan-builder.model';
import { CarePlanLinkComponent } from 'src/app/features/provider/care-plan/care-plan-link/care-plan-link.component';
import { unlink } from 'fs';
interface SampleData {
  id: number,
  description: string,
  is_diag_group: boolean
}
@Component({
  selector: 'care-plan-template-details',
  templateUrl: './care-plan-template-details.component.html',
  styleUrls: ['./care-plan-template-details.component.scss']
})
export class CarePlanTemplateDetailsComponent implements OnInit {
  loading: boolean = false;
  pageNumber = 1;
  pageSize = 5;
  searchText: string = '';
  typingTimer;
  doneTypingInterval = 1000;
  statusList: {}[];
  problems: {}[];
  id: number = 0;
  name: any;
  sampleData: SampleData[];
  status: boolean = true;
  totalRecords: number = 0;
  first = 0;
  totalRecordps: number = 0;
  saving: boolean = false;
  isunsaved: boolean = false;
  createGridForm: any;
  updateAssetsForm: any;
  careplandetailsAlllist: any[] = [];
  careplandetailsProblemslist: any[] = [];
  careplandetailsGoalslist: any[] = [];
  careplandetailsInterventionslist: any[] = [];
  careplandetailsBarrierslist: any[] = [];
  seleceddata: any;
  ref: DynamicDialogRef;
  EpisodeName: string
  diag: [];
  createCareBuilderForm: any;
  filteredProblemPlan: any = [];
  selectedProblem: any;
  linkproblemlistModel: LinkproblemlistModelNew[] = [];
  linkedCarePlanBuilderItemSave: LinkedCarePlanBuilderItemSave[] =[];
  unlinkedCarePlanBuilderItemSave: UnlinkedCarePlanBuilderItemSave[] = [];
  saveCarePlanTemplateDetails: SaveCarePlanTemplateDetails = new SaveCarePlanTemplateDetails();
  assetsselectedType: any;
  assetsSelectedGoalId: any;
  assetsSelectedInterventionId: any;
  assetsGoal: any;
  assetsIntervention: any;
  linkgoalsList: any = [];
  careplan_status: any;
  careplan_priority: any;
  isCareTeamMember: any;
  assetslist: any[];
  assetstype: { id: number; key: string; code: string }[];
  isDisable: boolean = true;
  goalsList: any = [];
  temp_goalsList: any = [];
  problemsList: any = [];
  interventionList: any = [];
  filteredProblemId: any = [];
  filteredId: any;
  priorityList: any = [];
  assetName: string;
  assetsArray: any = [];
  showDueDate: boolean = false;
  priorityChange: ChangePriority; 
  cpBarrierList: CPBarrier[] = [] //new CPBarrier();
  cpInterventionList: CPIntervention[] = [] //= new CPIntervention();
  cpGoalList: CPGoal[] = []// = new CPGoal();
  cpProblemList : CPProblem[] = [] // new CPProblem();
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private commonService: CommonService,
    private _carePlanService: ProviderScheduleService,
    private _route: ActivatedRoute
    ) {
    this.EpisodeName = this.commonService.getEpisodeName();
    this.id = Number(this._route.snapshot.queryParamMap.get('id'));
    this.name = this._route.snapshot.queryParamMap.get('name');
    this.status = JSON.parse(this._route.snapshot.queryParamMap.get('status'));
    this.statusList = [{ id: true, name: 'Active' }, { id: false, name: 'Disabled' }]
    this.sampleData = [{ id: 1, is_diag_group: true, description: 'this in new problems', },
    { id: 2, is_diag_group: true, description: 'Member does not understand how to use home equipment', }];

    this.assetstype = [{ id: 1, key: 'problems', code: 'Problem' },
    { id: 2, key: 'goal', code: 'Goal' },
    { id: 3, key: 'intervention', code: 'Intervention' }]

  }

  ngOnInit(): void {
    this.createCareBuilderForm = this._fb.group({
      diagid: [0],
      assetstypekey: [''],
      episode_id: [''],
      problem: ['']
    });

    if (this.id == 0) {
      this.createGridForm = this._fb.group({
        id: [this.id],
        name: ['', [Validators.required]],
        status: [true, [Validators.required]],
      });
    }
    else {
      this.createGridForm = this._fb.group({
        id: [this.id],
        name: [this.name, [Validators.required]],
        status: [this.status, [Validators.required]],
      });
    }

    this.updateAssetsForm = this._fb.group({
      assettype: ['', [Validators.required]],
      assetId: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
    });

    this.getCarePlanTemplatesDeatils();
    this.getMasterData();
  }

  back() {
    this._router.navigate(['/admin-clinical'], { queryParams: { tab: 5 } });
  }

  getCarePlanTemplatesDeatils() {
    this.loading = true;
    this.clinicalAssetService.getCarePlanTemplatesDeatilsList(this.id).subscribe(
      (result: any) => {
        this.loading = false;
        this.careplandetailsAlllist = result.body;
        this.careplandetailsProblemslist = result.body.cPProblems;
        this.totalRecordps = this.careplandetailsProblemslist.length;
        this.careplandetailsGoalslist = result.body.cpGoal;
        this.careplandetailsInterventionslist = result.body.cpIntervention;
        this.cpProblemList = result.body.cPProblems;
        this.cpGoalList = result.body.cpGoal;
        this.cpInterventionList = result.body.cpIntervention;
        this.cpBarrierList = result.body.cpBarrier;
        
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  addCarePlanDeatils(headData, cp_type) {
    this.ref = this.dialogService.open(AddNewCarePlanTemplateDetailsComponent, {
      header: headData,
      width: '600px',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { templateData: this.id, cp_type: cp_type },
    });

    this.ref.onClose.subscribe((res) => {
      if (res != undefined) {
        if (res.data.status == 200) {
          this._messageService.add({
            severity: 'success',
            summary: res.data.message,
            detail: '',
          });
          this.getCarePlanTemplatesDeatils();
        }
        else {
          this._messageService.add({
            severity: 'error',
            summary: res.data.message,
            detail: 'Error while saving data',
          });
          this.getCarePlanTemplatesDeatils();
        }
      }
      else {
        this.getCarePlanTemplatesDeatils();
      }
    });
  }

  getAssetName(e: any) {
    if(e.value == 'problems') {
      this.showDueDate = false;
      this.assetName = 'Problem';
      this.assetsArray = this.careplandetailsProblemslist;
    }
    if(e.value == 'goal') {
      this.showDueDate = true;
      this.assetName = 'Goal';
      this.assetsArray = this.careplandetailsGoalslist;
    }
    if(e.value == 'intervention') {
      this.showDueDate = false;
      this.assetName = 'Intervention';
      this.assetsArray = this.careplandetailsInterventionslist;
    }

  }

  updateAssets(data: any) {
    this.priorityChange = new ChangePriority();
    this.priorityChange.assetId = data.assetId;
    this.priorityChange.assetType = data.assettype;
    this.priorityChange.priority = data.priority;
    this.priorityChange.dueDate = data.dueDate;

    if (!this.updateAssetsForm.valid) 
    {
      
    }
    this.clinicalAssetService.UpdatePriority(this.priorityChange).subscribe(
      (res: any) => {

      }, (error) => {
        this.loading = false;
      }
    )
    return;


  }

  isTemplateSaving:boolean=false;
  onSubmit(formData: any) {
    if (!this.createGridForm.valid) return;
    this.isTemplateSaving = true;

    const obj = {
      id: formData.id,
      name: formData.name.trim(),
      active: formData.status,
    }
    this.clinicalAssetService.addUpdateCarePlanTemplate(obj).subscribe(
      (res: any) => {
        this.isTemplateSaving = false;
        if (res != undefined) {
          if (res.status == 200) {
            this._messageService.add({
              severity: 'success',
              summary: res.message,
              detail: '',
            });

          }
          else {
            this._messageService.add({
              severity: 'error',
              summary: res.message,
              detail: 'Error while saving data',
            });

          }
        }


      }, (error) => {
        this.loading = false;
      })

  }

  deleteCarePlanDetails(id: any) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to remove this Care Plan Template?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        this.clinicalAssetService.deleteCarePlanDetails(id).subscribe(
          (res: any) => {
            this.loading = false;
            if (res != undefined) {
              if (res.status == 200) {
                this._messageService.add({
                  severity: 'success',
                  summary: res.body.message,
                  detail: '',
                });
                this.confirmationService.close();
                this.getCarePlanTemplatesDeatils();
              }
              else {
                this._messageService.add({
                  severity: 'error',
                  summary: res.body.message,
                  detail: 'Error while deleting  data',
                });
                this.confirmationService.close();
              }
            }
          }, (error) => {
            this.loading = false;
          })
      },
    });
  }

  loadLazy(event) {
    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;
    this.pageNumber = this.pageNumber;
    this.pageSize = this.pageSize;
    this.getCarePlanTemplatesDeatils();

  }

  selectChangePageSize(event: any) {
    this.pageNumber = 1;
    this.pageSize = parseInt(event.target.value);
    this.getCarePlanTemplatesDeatils();
  }

  searchDiagnosis(event: any) {
    this.pageNumber = 1;
    this.searchText = event.target.value;
    // this.getDiagnosisList();
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => { this.getCarePlanTemplatesDeatils() }, this.doneTypingInterval);

  }

  paginate(event) {
    this.first = event.first;
  }

  reloadData() {
    this.searchText = '';
    this.getCarePlanTemplatesDeatils();
  }

  getMasterData() {
    this._carePlanService.getMasterData('diag,problem,barrier,careplan_status,careplan_priority', '').subscribe((result: any) => {
      this.careplan_status = result.careplan_status.filter(x => x.code_key == 'Open');
      this.priorityList = result.careplan_priority;
      this.careplan_priority = result.careplan_priority.filter(x => x.code_key == 'Medium');;
      this.diag = result.diag;
    }, error => {
    });
  }

  getCarePlanPGI(event) {
    this.assetslist
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.assetslist.length; i++) {
      let name = this.assetslist[i].code;
      if (name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(name);
        this.filteredId = this.assetslist[i].id;
      }
      this.filteredProblemPlan = filtered;
      this.filteredProblemId.push(this.filteredId);
    }
  }

  requestData: any[] = [];
  addTolinklist(event: any, id: any) {
    // this.selectedProblem
    // this.selectedkey;
    this.filteredId = this.assetslist.filter(x => x.code == event)
    this.isDisable = false;
    if (this.selectedkey == 'goal') {
      let goaldata = new unlinkgoal();
      goaldata.id = this.filteredId[0].id;
      goaldata.name = event
      let existgoal = this.goalsList.filter(item => item.goals === goaldata.name);
      let existtempgoal = this.temp_goalsList.filter(temp => temp.goal_id == goaldata.id)
      if (existgoal.length == 0) {
        this.goalsList.push({ goals: goaldata.name, goal_id: goaldata.id, isLinked: false });
        // this.linkproblemlistModel.forEach(x => {
          this.requestData.push(
            {
              id: 0,
              active: true,
              care_plan_id: this.id,
              cp_type: 'goal',
              diag_id: this.createCareBuilderForm.get('diagid').value,
              description: event,
              goal_id: goaldata.id
            }
          );
        // });
      }
    }
    else if (this.selectedkey == 'problems') {
      let problemdata: any;
      problemdata = event;
      let existproblem = this.linkproblemlistModel.filter(item => item.problem_name === problemdata);
      if (existproblem.length == 0) {
        this.linkproblemlistModel.push({
          linkproblem_id: this.filteredId[0].id, problem_name: problemdata, linkgoalListModel: [], allUnlinkAssets: [] = [],
          id: 0,
          description: problemdata,
          diag_id: this.createCareBuilderForm.get('diagid').value,
          cp_type: 'problem',
          care_plan_id: this.id,
          active: true,
          is_linked: false,
        });
        this.problemsList.push({ problem: problemdata, problem_id: this.filteredId[0].id, isLinked: false });
      }
    }
    else if (this.selectedkey == 'intervention') {
      let existIntervention = this.interventionList.filter(item => item.intervention === event);
      if (existIntervention.length == 0) {
        this.interventionList.push({ intervention: event, intervention_id: this.filteredId[0].id, isLinked: false })
        // this.linkproblemlistModel.forEach(x => {
          this.requestData.push(
            {
              id: 0,
              active: true,
              care_plan_id: this.id,
              cp_type: 'intervention',
              diag_id: this.createCareBuilderForm.get('diagid').value,
              description: event,
              intervention_id: this.filteredId[0].id
            }
          );
        // });
      }
    }
  }

  onDiag(event: any) {
    this.createCareBuilderForm.controls['assetstypekey'].setValue('');
    this.createCareBuilderForm.controls['problem'].setValue('');
    event
  }

  selectedkey: any;
  getAssets(event: any) {
    this.createCareBuilderForm.controls['problem'].setValue('');
    var data = this.createCareBuilderForm.getRawValue();
    this.selectedkey = event.value;
    this._carePlanService.getListByDiagId(data.diagid, this.selectedkey).subscribe((result: any) => {
      this.assetslist = [];
      this.assetslist = result;
    }, error => {
    });
  }

  deleteLinkproblemModel(id: number) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to remove this Problem?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        const index: number = this.linkproblemlistModel.findIndex(x => x.linkproblem_id == id);
        const index1: number = this.problemsList.findIndex(x => x.problem_id == id);
        var datalist = this.linkproblemlistModel.filter(x => x.linkproblem_id == id);
        datalist.forEach(x => {
          x.linkgoalListModel.forEach(y => {
            const index_goal: number = this.temp_goalsList.findIndex(z => z.goal_id == y.goal_id)
            if (index_goal !== -1) {
              this.temp_goalsList.splice(index_goal, 1);
            }
            y.linkinterventionListModel.forEach(int => {
              const index_inter: number = this.temp_goalsList.findIndex(z => z.goal_id == y.goal_id)
            })
          })
        })
        if (index !== -1) {
          this.linkproblemlistModel.splice(index, 1);
          this.requestData.splice(index, 1);
        }
        if (index1 !== -1) {
          this.problemsList.splice(index, 1);
        }
        if (this.linkproblemlistModel.length == 0) {
          this.isDisable = true
        }
        this.confirmationService.close();
      },
    });
  }

  deleteLinkgoal(id: number) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to remove this Goal?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        var index: any;
        this.linkproblemlistModel.forEach(x => {

          index = x.linkgoalListModel.findIndex(x => x.goal_id == id);
          if (index !== -1) {
            x.linkgoalListModel.splice(index, 1);
          }
        })
        const index1: number = this.temp_goalsList.findIndex(x => x.goal_id == id)
        if (index1 !== -1) {
          this.temp_goalsList.splice(index, 1);
        }
        this.confirmationService.close();
      },
    });
  }

  deleteLinklinkintervention(id: number) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to remove this Intervention?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        var index: any;
        this.linkproblemlistModel.forEach(x => {
          x.linkgoalListModel.forEach(goalitem => {
            index = goalitem.linkinterventionListModel.findIndex(x => x.intervention_id == id);
            if (index !== -1) {
              goalitem.linkinterventionListModel.splice(index, 1);
            }
          })
        })
        this.confirmationService.close();
      },
    });
  }

  deleteInterventionAssets(id: number) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to remove this Intervention?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        const index: number = this.interventionList.findIndex(x => x.intervention_id == id);
        this.linkproblemlistModel.forEach((x, i)=> {
          x.allUnlinkAssets.forEach((item, idx) => {
            if(item.intervention_id == id) {
              x.allUnlinkAssets.splice(idx, 1);
            }
          });
        });
        if (index !== -1) {
          this.interventionList.splice(index, 1);
        }
        this.confirmationService.close();
      },
    });

  }

  deleteGoalAssets(id: number, active: boolean) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to remove this Goal?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle text-dangure',
      reject: () => {
        this.confirmationService.close();
      },
      accept: () => {
        const index: number = this.goalsList.findIndex(x => x.goal_id == id);
        const index1: number = this.temp_goalsList.findIndex(x => x.goal_id == id);
        this.linkproblemlistModel.forEach((x, i)=> {
          x.allUnlinkAssets.forEach((item, idx) => {
            if(item.goal_id == id) {
              x.allUnlinkAssets.splice(idx, 1);
            }
          });
        });

        if (index !== -1) {
          this.goalsList.splice(index, 1);
        }
        if (index1 !== -1 && active == true) {
          this.temp_goalsList.splice(index, 1);
        }
        this.confirmationService.close();
      },
    });

  }

  deleteGoal(id: number, active: boolean) {
    const index: number = this.goalsList.findIndex(x => x.goal_id == id);
    const index1: number = this.temp_goalsList.findIndex(x => x.goal_id == id)
    // this.linkproblemlistModel.forEach((x, i)=> {
      this.requestData.forEach((item, idx) => {
        if(item.goal_id == id) {
          this.requestData.splice(idx, 1);
        }
      });
    // });
    if (index !== -1) {
      this.goalsList.splice(index, 1);
    }
    if (index1 !== -1 && active == true) {
      this.temp_goalsList.splice(index, 1);
    }
  }

  deleteIntervention(id: number) {
    const index: number = this.interventionList.findIndex(x => x.intervention_id == id);
    // this.linkproblemlistModel.forEach((x, i)=> {
    //   x.allUnlinkAssets.forEach((item, idx) => {
    //     if(item.intervention_id == id) {
    //       x.allUnlinkAssets.splice(idx, 1);
    //     }
    //   });
    // });
    this.requestData.forEach((item, idx) => {
      if(item.intervention_id == id) {
        this.requestData.splice(idx, 1);
      }
    });
    if (index !== -1) {
      this.interventionList.splice(index, 1);
    }
  }

  addlink(event: any, selectedType, assets) {
    if (this.linkproblemlistModel.length == 0 && selectedType == 'goal') {
      this._messageService.add({
        severity: 'info',
        summary: 'Please Add Problem',
      });
      return
    }
    else if (this.linkproblemlistModel.length == 0 || this.linkproblemlistModel[0].linkgoalListModel.length == 0 && selectedType == 'intervention') {
      this._messageService.add({
        severity: 'info',
        summary: 'Please Add Problem',
      });
      return
    }
    this.assetsselectedType = selectedType;
    this.assetsSelectedGoalId = assets.goal_id;
    this.assetsSelectedInterventionId = assets.intervention_id;
    this.assetsGoal = assets.goals;
    this.assetsIntervention = assets.intervention
    if (event.value == undefined) {
      this.ref = this.dialogService.open(CarePlanLinkComponent, {
        header: selectedType == 'goal' ? 'Link Goal to Problem' : 'Link Intervention to Goal',
        width: '750px',
        contentStyle: { "max-height": "90vh" },
        data: { problems: this.problemsList, goals: this.temp_goalsList, assetstype: selectedType },
      });
      this.ref.onClose.subscribe((result) => {
        
        if (result != undefined) {
          this.isDisable = false;
          let linkproblem = this.problemsList.filter(x => x.problem_id == result.data.linkproblem_id);

          let linkgoal = new LinkgoalListModel();
          let linkinterventionList = new LinkinterventionListModel()
          
          if (this.assetsselectedType == 'goal') {  
            linkgoal.goal_id = this.assetsSelectedGoalId;
            linkgoal.goal = this.assetsGoal;
            linkgoal.link_problem_id = result.data.linkproblem_id;
            linkgoal.linkinterventionListModel = [];
            this.temp_goalsList.push({ goals: this.assetsGoal, goal_id: this.assetsSelectedGoalId });
            this.deleteGoal(this.assetsSelectedGoalId, false);
            var goalExists: any
            if (this.linkgoalsList.length > 0) {
              this.linkgoalsList.forEach(x => {
                if (x.linkproblem_id == linkgoal.link_problem_id) {
                  if (x.linkgoalListModel.goal_id == linkgoal.goal_id) {
                    goalExists = x.linkgoalListModel
                  }
                  if (goalExists != undefined) {
                    this.linkgoalsList.push({ linkproblem_id: result.data.linkproblem_id, problem_name: linkproblem[0].problem, linkgoalListModel: linkgoal })
                    
                    let problemIndex = this.problemsList.findIndex(x => x.problem_id == result.data.linkproblem_id);
                    this.problemsList[problemIndex].isLinked = true;

                    let goalIndex = this.goalsList.findIndex(x => x.goal_id == assets.goal_id);
                    this.goalsList[goalIndex].isLinked = true;
                  }
                }
              })
            }
            else {
              this.linkgoalsList.push({ linkproblem_id: result.data.linkproblem_id, problem_name: linkproblem[0].problem, linkgoalListModel: linkgoal })
            }
          }
          else {
            let linkintervention = this.interventionList.filter(x => x.intervention_id == this.assetsSelectedInterventionId);
            linkinterventionList.intervention = linkintervention[0].intervention;
            linkinterventionList.intervention_id = this.assetsSelectedInterventionId;
            linkinterventionList.link_goal_id = result.data.linkgoal_id;
            this.deleteIntervention(this.assetsSelectedInterventionId);
          }
          this.linkproblemlistModel.forEach(item => {
            
            if (item.linkproblem_id == result.data.linkproblem_id || result.data.linkgoal_id != '') {
              if (linkgoal.link_problem_id != undefined) {
                
                item.linkgoalListModel.push(linkgoal);
              }
              else if (item.linkgoalListModel.find(x => x.goal_id == result.data.linkgoal_id)) {
                item.linkgoalListModel.forEach(goalitem => {
                  if (goalitem.goal_id == result.data.linkgoal_id) {
                    goalitem.linkinterventionListModel.push(linkinterventionList)
                  }
                })
              }
            }
          })
        }
      });
      this.linkproblemlistModel
    }
    
  }

  saveAssets(value: any) {
    var d = this.createCareBuilderForm.getRawValue();
    if (this.createCareBuilderForm.invalid) {
      this.loading = false;
      return;
    }
    this.loading = true;
    const model = {
      allAssets: this.linkproblemlistModel,
    }
    model.allAssets.forEach(item => {

      if(item.linkgoalListModel.length > 0)
      {
        const prob = {
          CPType : 1,
          CarePlanId: item.care_plan_id,
          description: item.description,
          DiagnosticId: item.diag_id,
          IsDiagnosticGroup: false,
          Priority: 1,
          DueDate: new Date(),
          ParentDescription: null,
          TemplateId: item.linkproblem_id,
          
        }
        this.linkedCarePlanBuilderItemSave.push(prob);
        
        
        item.linkgoalListModel.forEach(item2 =>{
          const goal = {
            CPType : 2,
            CarePlanId: item.care_plan_id,
            description: item2.goal,
            DiagnosticId: item.diag_id,
            IsDiagnosticGroup: false,
            Priority: 1,
            DueDate: new Date(),
            ParentDescription: item.description,
            TemplateId: item2.goal_id,
          }
          this.linkedCarePlanBuilderItemSave.push(goal);
  
          item2.linkinterventionListModel.forEach(item3 =>{
            const intervention = {
              CPType : 3,
              CarePlanId: item.care_plan_id,
              description: item3.intervention,
              DiagnosticId: item.diag_id,
              IsDiagnosticGroup: false,
              Priority: 1,
              DueDate: new Date(),
              ParentDescription: item2.goal,
              TemplateId: item3.intervention_id,
            }
            this.linkedCarePlanBuilderItemSave.push(intervention);
          });
        })
      }
      else{
            this.unlinkedCarePlanBuilderItemSave.push({
            CPType: 1,
            CarePlanId: item.care_plan_id,
            description: item.description,
            DiagnosticId: item.diag_id,
            IsDiagnosticGroup: false,
            Priority: 1,
            DueDate: new Date(),
            TemplateId: item.linkproblem_id,
          });
      }
    })
    this.requestData.forEach(unlinkProb =>{
        this.unlinkedCarePlanBuilderItemSave.push({
          CPType: unlinkProb.cp_type === 'goal' ? 2 : unlinkProb.cp_type === 'intervention' ? 3 : unlinkProb.cp_type,
          CarePlanId: unlinkProb.care_plan_id,
          description: unlinkProb.description,
          DiagnosticId: unlinkProb.diag_id,
          IsDiagnosticGroup: false,
          Priority: 1,
          DueDate: new Date(),
          TemplateId: unlinkProb.cp_type === 'goal' ? unlinkProb.goal_id : unlinkProb.intervention_id 
      })
    })




    
    this.saveCarePlanTemplateDetails.LinkedItems = this.linkedCarePlanBuilderItemSave;
    this.saveCarePlanTemplateDetails.UnlinkedItems = this.unlinkedCarePlanBuilderItemSave;
    

    this.clinicalAssetService.addUpdateCarePlanTemplateDeatils(this.saveCarePlanTemplateDetails).subscribe((result: any) => {
      if (result.status == 200) {
        this.saveCarePlanTemplateDetails.LinkedItems.length = 0;
        this.saveCarePlanTemplateDetails.UnlinkedItems.length = 0;
        this.requestData.length = 0;
        this.linkproblemlistModel.length = 0;
        this.goalsList.length = 0;
        this.interventionList.length = 0;
        this.createCareBuilderForm.reset();
        this._messageService.add({
          severity: 'info',
          summary: result.message,
        });
        this.getCarePlanTemplatesDeatils();
        // this.ref.close({ data: result });
      } else if (result.status == 403) {
        this._messageService.add({
          severity: 'info',
          summary: result.message,
        });
        this.loading = false;
      }
    },
      (error) => {
        this.loading = false;
        // this.ref.close({ data: 'error' });
      })
  }
  changePriority(event: any, id: any)
  {
  }
}
