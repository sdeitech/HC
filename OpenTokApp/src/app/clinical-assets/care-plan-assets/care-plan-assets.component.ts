import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { all_episode_list, clinician_list, data_list } from '../../provider/models/MemberRosterReqModel';
import { ProviderScheduleService } from '../../provider/services/provider-schedule.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DataExchangeService } from 'src/app/services/common/data-exchange.service';
import { CustomerKey } from 'src/app/models/customer-key';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-care-plan-assets',
  templateUrl: './care-plan-assets.component.html',
  styleUrls: ['./care-plan-assets.component.scss'],
  providers: [MessageService],
})


export class CarePlanAssetsComponent implements OnInit {

  ref: DynamicDialogRef;
  FilterForm: FormGroup;
  patientData: any;
  patientEmpi: any;
  isReadOnly: boolean = false;
  encounterData: any;
  isPatientData: boolean = false;
  appointmentId: any;
  isMemberRoster: any;
  project_id: number;
  patientInfo: any;
  iscareplan: boolean = true;
  masterdata: any;
  episodes: [];
  careplan_status: [];
  careplan_priority: [];
  diag: [];
  problem: [];
  problems_List: any;
  goals_List: any;
  barriers_List: any;
  diagDto: any;
  interventionsList: any;
  episode_id: number = null;
  status_id: number = null;
  clinician_id: number = null;
  episode_status: data_list[];
  clinicalUsers: clinician_list[];
  all_episodes: all_episode_list[];
  loading: boolean = false;
  selectedIndex = 0;
  isEncounter: boolean = false;
  IsView: boolean = false;
  pageNumber = 1;
  pageSize = 10;
  searchText: string = '';
  totalRecords: number = 0;
  first = 0;
  tableSizes = [5, 10, 25, 50, 100];
  sortColumn: any;
  sortOrder: any;
  userEncounterList: any = [];
  constructor(public dialogService: DialogService,
    private commonService: CommonService,
    public _dataService: DataExchangeService,
    private _providerService: ProviderScheduleService,
    private _route: ActivatedRoute) {
    this.patientEmpi = this.commonService.encryptValue(
      this._route.snapshot.queryParamMap.get('empi'),
      false
    );

    this.appointmentId = this.commonService.encryptValue(
      this._route.snapshot.queryParamMap.get('appt'),
      false
    );
  }

  ngOnInit(): void {
    this.getCustomerKey();
    this._providerService.getMasterData('diag', '').subscribe((result: any) => {
      this.masterdata = result;
      this.diag = result.diag;
    }, error => {
    });
  }
  isCleverCare: boolean = false;
  getCustomerKey() {
    if (environment.customerKey == CustomerKey.CleverCare) {
      this.isCleverCare = true;
    }

  }
  onSelectTab(event: any) {
    this.selectedIndex = event.index;
    if (this.selectedIndex == 0) {

    }
  }
}
