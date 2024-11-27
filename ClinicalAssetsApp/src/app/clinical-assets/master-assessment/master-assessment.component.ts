import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InboundService } from '../../inbound/services/inbound.service';
import { NewProfileSectionModalComponent } from '../new-profile-section-modal/new-profile-section-modal.component';
import { ClinicalAssetService } from '../services/clinical-asset.service';
import { JwtTokenServiceService } from 'src/app/services/jwt-token-service.service';
@Component({
  selector: 'app-master-assessment',
  templateUrl: './master-assessment.component.html',
  styleUrls: ['./master-assessment.component.scss'],
  providers: [ConfirmationService]
})
export class MasterAssessmentComponent implements OnInit {
  ref: DynamicDialogRef;
  sectionsData: any;
  projectAssociatedWithSections: any;
  editSectionDetails: any = {};
  loading: boolean;
  firstSortedList: any;
  secondSortedList: any;
  listStyle = {
    dropZoneHeight: '50px'
  }
  selectedIndex = 0;
  appointmenttypeAssociatedWithSections: any;
  allProjectList: any;
  selectedProjectId: any;
  isRemoveDisabled: boolean = false;
  loaderStatus:boolean=true;
  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
    private clinicalAssetService: ClinicalAssetService,
    private _route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private _inboundService: InboundService,
    private readonly jwtService: JwtTokenServiceService
  ) {
    this.firstSortedList = this.sectionsData;
    if (this._route.snapshot.queryParams != {}) {

      this.selectedIndex = this._route.snapshot.queryParams['tab'] || 0;
    }

    //this.isAdminRole();
    this.getClinicalAssetsUserRole();
  }

  ngOnInit(): void {
    this.getSection(0);
    this.getAllProjectList();
  }

  listSorted(list: any) {
    this.firstSortedList = list;
    let order = 0;
    this.firstSortedList.forEach((x) => {
      x.sort_order = order + 1
      order++;
    })
  }

  newProfileSectionModal(value) {
    if (value == 0)
      this.editSectionDetails = {};      
    this.ref = this.dialogService.open(NewProfileSectionModalComponent, {
      header: value == 0 ? 'Create Section ' : 'Update Section',
      width: '50vw',
      styleClass: 'customClass',
      contentStyle: { "max-height": "90vh", "overflow": "hidden" },
      data: { editSection: this.editSectionDetails },
    });
    this.ref.onClose.subscribe((result) => {
      if (result != undefined) {
        if (result.data.status == 200) {
          this.messageService.add({ severity: 'success', summary: result.data.message });
          this.getSection(this.selectedProjectId);
        }
        else {
          this.messageService.add({ severity: 'info', summary: 'Error', detail: result.errorDetail })
        }
      }
      else {
        this.getSection(this.selectedProjectId);
      }
    });
  }

  onSelectTab(event: any) {
    this.selectedIndex = event.index;
    if (this.selectedIndex == 0) {
      this.getSection(this.selectedProjectId);
    }
    if (this.selectedIndex == 1) { }
  }

  getSection(projectId: number) {
    this.clinicalAssetService.getSection(projectId, this.isRemoveDisabled).subscribe(
      (result: any) => {
        this.sectionsData = result.body.sections;
        this.projectAssociatedWithSections = result.body.project;
        this.appointmenttypeAssociatedWithSections = result.body.appointment_type;
        // console.log(this.appointmenttypeAssociatedWithSections);
        this.firstSortedList = this.sectionsData;
      },
      (error) => { }
    );
  }

  editSection(users) {
    this.editSectionDetails = users;
    this.newProfileSectionModal(users.id)
  }
  // deleteSection(users) {
  //   this.editSectionDetails = users;
  //   this.newProfileSectionModal(users.id)
  // }
  deleteSection(users) {
    //console.log(JSON.stringify(users));
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this section? Doing so may alter the format of clinical documentation.',
      header: 'Delete ' + users.name + ' Section',
      icon: 'pi pi-info-circle',
      accept: () => {
        let request = {
          id: users.id
        };
        this.clinicalAssetService.deleteSection(request).subscribe((result: any) => {
          this.loading = false;
          if (result.status == 200) {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: result.message });
            this.getSection(this.selectedProjectId);
          }
          else {
            this.messageService.add({ severity: 'info', summary: 'Error', detail: result.errorDetail })
          }
        })

      },
      reject: () => {
        //this.messageService.add({ severity: 'success', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }


  getProjectList(id: any): any {
    var foundValue = this.projectAssociatedWithSections.filter(obj => obj.section_id == id);

    return foundValue;
  }
  showList(id: any): string {
    let temp: string = ``;
    var foundValue = this.projectAssociatedWithSections.filter(obj => obj.section_id == id);
    for (let project of foundValue) {
      temp += ` <div class="badge badge-primary">
                 <span>${project.name}</span>
                 </div>`;
    }

    return temp;
  }

  saveOrder() {
    var saveObj = {
      sort_order_list: this.firstSortedList
    };
    this.loading = true;
    this.clinicalAssetService.saveSectionOrder(saveObj).subscribe((result) => {
      this.loading = false;
      if (result.status == 200) {
        this.messageService.add({ severity: 'success', summary: result.message });
        this.getSection(this.selectedProjectId);
      }
      else {
        this.messageService.add({ severity: 'info', summary: 'Error', detail: result.errorDetail })
      }
    });
  }
  getAllProjectList() {    
    this.allProjectList = [];
    this._inboundService.getProjectList().subscribe((response: any) => {
      if (response != null) { 
        this.loaderStatus=false;       
        this.allProjectList.push({ id: 0, name: 'All Projects', twilliophonenumber: '' });
        response.body.forEach(x => {
          this.allProjectList.push({ id: x.id, name: x.name, twilliophonenumber: x.twilliophonenumber });
        });


      }
    });
  }
  filterByProject() {
    this.getSection(this.selectedProjectId);
  }
  onRemove() {
    this.getSection(this.selectedProjectId);
  }

  //#region Clinical Assets Authentication Section

  isAdministrator: boolean = false;

  //isClinical: boolean = false;
  isClinicalAssessment: boolean = false;
  isClinicalCareAssets: boolean = false;
  isClinicalCareTemp: boolean = false;
  isClinicalCoding: boolean = false;
  isClinicalDatagrid: boolean = false;
  isClinicalDynDatagrid: boolean = false;
  isClinicalSection: boolean = false;


  isAdminRole() {
    var isAdmin = this.jwtService.getLoginUserRoles()
    if (isAdmin == 'Administrators') {
      this.isAdministrator = true;
    }
  }

  getClinicalAssetsUserRole() {

    // if (this.jwtService.isClinical()) {
    //   this.isClinical = true;
    // }
    if (this.jwtService.isClinicalAssessment()) {
      this.isClinicalAssessment = true;
    }
    if (this.jwtService.isClinicalCareAssets()) {
      this.isClinicalCareAssets = true;
    }
    if (this.jwtService.isClinicalCareTemp()) {
      this.isClinicalCareTemp = true;
    }
    if (this.jwtService.isClinicalCoding()) {
      this.isClinicalCoding = true;
    }
    if (this.jwtService.isClinicalDatagrid()) {
      this.isClinicalDatagrid = true;
    }
    if (this.jwtService.isClinicalDynDatagrid()) {
      this.isClinicalDynDatagrid = true;
    }
    if (this.jwtService.isClinicalSection()) {
      this.isClinicalSection = true;
    }

  }


  //#endregion

}
