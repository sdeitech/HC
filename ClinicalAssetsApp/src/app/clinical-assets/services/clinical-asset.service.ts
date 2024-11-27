import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentUrlService } from 'src/app/environment-url.service';


@Injectable({
  providedIn: 'root'
})
export class ClinicalAssetService {

  constructor(private _http: HttpClient, private _envUrl: EnvironmentUrlService) { }
  baseUrl = this._envUrl.urlAddress;
  private getSectionData = '/api/AdminClinicalMemberProfile/GetSections';
  private getAssessmentDatagridList = '/api/AdminClinicalMemberProfile/GetAssessmentDatagridList';
  private createNewSection = '/api/AdminClinicalMemberProfile/CreateNewSection'
  private DeleteSectionUrl = '/api/AdminClinicalMemberProfile/DeleteSection'

  private saveOrder = '/api/AdminClinicalMemberProfile/UpdateSortOrder';
  private getGuidlineData = '/api/CodingGuidline/GetCodingGuidlineList';
  private getDataGridData = '/api/DataGrid/GetDataGridList';
  private updatetDataGridData = '/api/DataGrid/UpdateDataGridRoles';
  private saveUpdateGuidline = '/api/CodingGuidline/SaveUpdateCodingGuidline';
  private getMasterDataApiUrl = '/api/MasterData/GetMasterDataDetails';
  private getAllAssessmentData = '/api/AdminClinicalAssessment/GetAssessmentDetails?assessment_id='
  private newAssessment = "/api/AdminClinicalAssessment/CreateNewAssessment"

  private getCarePlanList = '/api/ManageCarePlanAssets/GetAllCareplanMasterData';
  private getCarePlanDiagnosis = '/api/ManageCarePlanAssets/GetCareplanDiagnosisData';
  private getCarePlanProblems = '/api/ManageCarePlanAssets/GetCareplanProblemsData';
  private getCarePlanGoals = '/api/ManageCarePlanAssets/GetCareplanGoalsData';

  private getCarePlanInterventions = '/api/ManageCarePlanAssets/GetCareplanInterventionsData';
  private getCarePlanBarriers = '/api/ManageCarePlanAssets/GetCareplanBarriesData';
  private getCarePlanIdentifiedMemberRisks = '/api/ManageCarePlanAssets/GetCarePlanIdentifiedMemberRisksData';
  private getCarePlanGeneralComment = '/api/ManageCarePlanAssets/GetCarePlanGeneralCommentsData';
  private getDynamicDataGrid = '/api/DynamicDataGrid/GetDynamicDataGridList?id=';
  private getAllDynamicgridMaster = '/api/DynamicDataGrid/GetDynamicDataGridMasterData';
  private AddUpdateDynamicGrid = '/api/DynamicDataGrid/CreateNewDynamicGrid';
  private addUpdateDgField = '/api/DynamicDataGrid/CreateNewDgField';
  private getDgFieldList = '/api/DynamicDataGrid/GetDgFieldList';
  private AddUpdateCarePlanTemplate = '/api/CarePlanTemplate/SaveCarePlanTemplateData';
  private getCarePlanTemplateList = '/api/CarePlanTemplate/GetCarePlanTemplateData'
  private AddUpdateCarePlanTemplateDetails = '/api/CarePlanTemplate/SaveCarePlanTemplateDetailsData';
  private getCarePlanTemplateDetailsList = '/api/CarePlanTemplate/GetCarePlanTemplateDetailsData';
  // private createCarePlanTemplates = '/api/CarePlanTemplate/CreateCarePlanTemplate';
  private saveCarePlanbuilder = '/api/CarePlanTemplate/SaveCarePlanBuilder';
  private getCarePlanTemplatePGBIList = '/api/CarePlanTemplate/Getpgiblist';
  private deleteCarePlanTemplateDetails = '/api/CarePlanTemplate/DeleteCarePlanTemplateDetails'
  private deleteDgField = '/api/DynamicDataGrid/DeleteDgField';
  private AddUpdateFieldResponse = '/api/DynamicDataGrid/CreateNewFieldResponse';
  private UpdateFieldOrder = '/api/DynamicDataGrid/UpdateFieldSortOrder';
  private CreateNewFieldSuspect = '/api/DynamicDataGrid/CreateSuspectFieldCode';
  private CreateCPTGenFieldCode = '/api/DynamicDataGrid/CreateCPTGenFieldCode';
  private getCustomFeildsList = '/api/ScreenConfig/GetCustomFeildsList';
  private UpdateFieldUrl = '/api/ScreenConfig/UpdateScreenConfigFeild';
  private AddFieldUrl = '/api/ScreenConfig/AddScreenConfigFeild';
  private getCustomFeildValuesUrl = '/api/ScreenConfig/GetCustomFeildValues';
  private updateFieldValueUrl = '/api/ScreenConfig/UpdateFeildValue';
  private getAppointmentDetailsUrl = '/api/ClinicalAssests/GetAppointmentDetail';

  private updatePriority = '/api/CarePlanTemplate/updatePriority';
  private createCarePlanTemplates = '/api/CarePlanTemplate/saveCarePlanTemplate';
  getSection(projectId, isRemoveDisabled): Observable<HttpResponse<any[]>> {

    const url = this.baseUrl + this.getSectionData + `?projectId=${projectId}&isRemoveDisabled=${isRemoveDisabled}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getAssessmentDatagrid(): Observable<HttpResponse<any[]>> {

    const url = this.baseUrl + this.getAssessmentDatagridList;
    return this._http.get<any[]>(url, { observe: 'response' });
  }


  createSection(createSectionForm: any) {
    return this._http.post<any>(this.baseUrl + this.createNewSection, createSectionForm);
  }

  deleteSection(request: any) {
    return this._http.post<any>(this.baseUrl + this.DeleteSectionUrl, request);
  }

  saveSectionOrder(data: any) {
    return this._http.post<any>(this.baseUrl + this.saveOrder, data);
  }
  getGuidlinesData(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getGuidlineData;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getDatGridData(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getDataGridData;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  updateDataGrid(dataGridForm: any) {
    return this._http.post<any>(this.baseUrl + this.updatetDataGridData, dataGridForm);
  }

  createCarePlanTemplate(model: any) {
    const url = this.baseUrl + this.createCarePlanTemplates;
    return this._http.post<any>(url, model).pipe();
  }

  SaveCarePlanBuilder(model: any) {
    const url = this.baseUrl + this.saveCarePlanbuilder;
    return this._http.post<any>(url, model).pipe();
  }

  createNewTemplate(addForm: any) {
    const url = this.baseUrl + this.saveUpdateGuidline;
    return this._http.post<any>(url, addForm).pipe();

  }

  getMasterData(category_key: any, searchText: string) {
    const url = this.baseUrl + this.getMasterDataApiUrl + `?category_key=${category_key}&search_text=${searchText}`;
    return this._http.get<any[]>(url);
  }

  getMasterDataOrderbyKey(category_key: any, searchText: string, code: string, sortOrder: string) {
    const url = this.baseUrl + this.getMasterDataApiUrl + `?category_key=${category_key}&search_text=${searchText}&sortColumn=${code}&sortOrder=${sortOrder}`;
    return this._http.get<any[]>(url);
  }

  getAssessmentDetails(ass_id: any) {
    const url = this.baseUrl + this.getAllAssessmentData + ass_id;
    return this._http.get<any[]>(url);
  }

  addUpdateAssessment(assessmentData: any) {
    return this._http.post<any>(this.baseUrl + this.newAssessment, assessmentData);
  }

  getCarePlanData(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanList;
    return this._http.get<any[]>(url, { observe: 'response' });
  }


  getCarePlanDiagnosisData(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanDiagnosis + `?pageNumber=${model.pageNumber}&pagesize=${model.pagesize}&sortColumn=${model.sortColumn}&sortOrder=${model.sortOrder}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getCarePlanProblemsData(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanProblems + `?pageNumber=${model.pageNumber}&pagesize=${model.pagesize}&sortColumn=${model.sortColumn}&sortOrder=${model.sortOrder}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getCarePlanGoalsData(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanGoals + `?pageNumber=${model.pageNumber}&pagesize=${model.pagesize}&sortColumn=${model.sortColumn}&sortOrder=${model.sortOrder}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getCarePlanInterventionsData(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanInterventions + `?pageNumber=${model.pageNumber}&pagesize=${model.pagesize}&sortColumn=${model.sortColumn}&sortOrder=${model.sortOrder}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getCarePlanBarriersData(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanBarriers + `?pageNumber=${model.pageNumber}&pagesize=${model.pagesize}&sortColumn=${model.sortColumn}&sortOrder=${model.sortOrder}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }
  getCarePlanIdentifiedMemberRisksData(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanIdentifiedMemberRisks + `?pageNumber=${model.pageNumber}&pagesize=${model.pagesize}&sortColumn=${model.sortColumn}&sortOrder=${model.sortOrder}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }
  getCarePlanGeneralCommentsData(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanGeneralComment + `?pageNumber=${model.pageNumber}&pagesize=${model.pagesize}&sortColumn=${model.sortColumn}&sortOrder=${model.sortOrder}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getDynamicDataGridData(id = 0): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getDynamicDataGrid + id;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getAllDynamicgridMasterData(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getAllDynamicgridMaster;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  AddUpdateDynamicDataGrid(data: any): Observable<HttpResponse<any[]>> {
    return this._http.post<any>(this.baseUrl + this.AddUpdateDynamicGrid, data);
  }

  AddUpdateDgField(data: any): Observable<HttpResponse<any[]>> {
    return this._http.post<any>(this.baseUrl + this.addUpdateDgField, data);
  }

  getDgFieldsList(id: number, gridId: number): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getDgFieldList + `?id=${id}&grid_id=${gridId}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  addUpdateCarePlanTemplate(carePlanTaemplateData: any) {
    return this._http.post<any>(this.baseUrl + this.AddUpdateCarePlanTemplate, carePlanTaemplateData);
  }

  getCarePlanTemplatesList(): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanTemplateList;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  getCarePlanTemplatesPGBIList(model: any): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanTemplatePGBIList + `?searchType=${model.searchType}&searchText=${model.searchText}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  addUpdateCarePlanTemplateDeatils(carePlanTaemplateDetailsData: any) {
    return this._http.post<any>(this.baseUrl + this.AddUpdateCarePlanTemplateDetails, carePlanTaemplateDetailsData);
  }

  getCarePlanTemplatesDeatilsList(id): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCarePlanTemplateDetailsList + `?care_plan_id=${id}`;;
    return this._http.get<any[]>(url, { observe: 'response' });
  }
  deleteCarePlanDetails(id): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.deleteCarePlanTemplateDetails + `?id=${id}`;;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  deleteDgFieldData(id: number): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.deleteDgField + `?id=${id}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }

  AddUpdateFieldResponseData(data: any): Observable<HttpResponse<any[]>> {
    return this._http.post<any>(this.baseUrl + this.AddUpdateFieldResponse, data);
  }

  UpdateFieldOrderData(data: any): Observable<HttpResponse<any[]>> {
    return this._http.post<any>(this.baseUrl + this.UpdateFieldOrder, data);
  }

  CreateNewFieldSuspectData(data: any): Observable<HttpResponse<any[]>> {
    return this._http.post<any>(this.baseUrl + this.CreateNewFieldSuspect, data);
  }

  CreateNewCPTGenFieldCode(data: any): Observable<HttpResponse<any[]>> {
    return this._http.post<any>(this.baseUrl + this.CreateCPTGenFieldCode, data);
  }
  getCustomFeilds(): Observable<HttpResponse<any[]>> {

    const url = this.baseUrl + this.getCustomFeildsList;

    return this._http.get<any[]>(url, { observe: 'response' });
  }
  updateFeild(id: number, name: string, status: boolean): Observable<HttpResponse<any[]>> {
    var mdl = { id: id, name: name, status: status }
    return this._http.post<any>(this.baseUrl + this.UpdateFieldUrl, mdl);
  }
  addFeild(name: string): Observable<HttpResponse<any[]>> {
    var mdl = { name: name }
    return this._http.post<any>(this.baseUrl + this.AddFieldUrl, mdl);
  }
  getCustomFeildValues(empi: number): Observable<HttpResponse<any[]>> {
    const url = this.baseUrl + this.getCustomFeildValuesUrl + `?patient_empi=${empi}`;
    return this._http.get<any[]>(url, { observe: 'response' });
  }
  updateCustomFeildValues(id: number, value: string): Observable<HttpResponse<any[]>> {
    var mdl = { id: id, value: value }
    return this._http.post<any>(this.baseUrl + this.updateFieldValueUrl, mdl);
  }
  getAppointmentDetails() {
    return this._http.get<any>(this.baseUrl + this.getAppointmentDetailsUrl);
  }
  UpdatePriority(priorityChange: any) {
    return this._http.post<any>(this.baseUrl + this.updatePriority , priorityChange);
  }
}
