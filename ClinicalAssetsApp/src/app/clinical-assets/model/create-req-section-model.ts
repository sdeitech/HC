export interface CreateSectionReqModel {
    id: 0,
    status: boolean,
    project: string,
    assessment: string,
    datagrid: string,
    dg_datagrid: string,
    sectionname: string,
    appointmenttype: string,
    require_section: boolean,
    associated_project: boolean,
    associated_appointmentType: boolean,
    associated_appointmentDetails: boolean,
    associated_project_id: string,
    associated_appointmentType_id: string,
    associated_appointmentDetails_id: string
}
