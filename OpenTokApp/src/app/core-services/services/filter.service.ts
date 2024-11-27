import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  filterPatient(name: string, PatientList: any) {
    if (typeof name !== 'string') {
      return PatientList;
    }
    let arr = PatientList.filter(
      (data: any) => data.firstName.toLowerCase().includes(name.toLowerCase()) ||
        data.lastName.toLowerCase().includes(name.toLowerCase()) ||
        data.mrn.toLowerCase().includes(name.toLowerCase()) ||
        // data.preferredName.toLowerCase().includes(name.toLowerCase()) ||
        (data.firstName + data.lastName).toLowerCase().includes((name.replace(/\s+/g, '').trim()).toLowerCase())
    );
    return arr.length ? arr : [{ firstName: 'No client found', code: '0' }];
  }
  filterClient(name: string, PatientList: any, selectedClientIds: any) {
    if (typeof name !== 'string') {
      return PatientList;
    }
    let arr = PatientList.filter(
      (data: any) =>
        selectedClientIds.includes(data.clientId) ||
        data.firstName.toLowerCase().includes(name.toLowerCase()) ||
        data.lastName.toLowerCase().includes(name.toLowerCase()) ||
        data.mrn.toLowerCase().includes(name.toLowerCase()) ||
        // data.preferredName.toLowerCase().includes(name.toLowerCase()) ||
        (data.firstName + data.lastName).toLowerCase().includes((name.replace(/\s+/g, '').trim()).toLowerCase())
    );
    return arr.length ? arr : [{ firstName: 'No client found', code: '0' }];
  }

  filterProvider(name: string, ProviderList: any) {
    if (typeof name !== 'string') {
      return ProviderList;
    }
    let arr = ProviderList.filter(
      (data: any) => data.firstName.toLowerCase().includes(name.toLowerCase()) ||
        data.lastName.toLowerCase().includes(name.toLowerCase()) ||
        (data.firstName + data.lastName).toLowerCase().includes((name.replace(/\s+/g, '').trim()).toLowerCase())
    );
    return arr.length ? arr : [{ firstName: 'No Provider found', code: '' }];
  }

  filtercpt(name: string, cptList: any) {
    if (typeof name !== 'string') {
      return cptList;
    }
    let arr = cptList.filter(
      (data: any) => data.procedureId.toLowerCase().includes(name.toLowerCase()) ||
        data.description.toLowerCase().includes(name.toLowerCase()) ||
        (data.procedureId + data.description).toLowerCase().includes((name.replace(/\s+/g, '').trim()).toLowerCase())
    );
    return arr.length ? arr : [{ procedureId: 'No CPT found', code: '' }];
  }
  filtericd(name: string, cptList: any) {
    if (typeof name !== 'string') {
      return cptList;
    }
    let arr = cptList.filter(
      (data: any) => data.icdCode.toLowerCase().includes(name.toLowerCase()) ||
        data.icdCodeDesc.toLowerCase().includes(name.toLowerCase()) ||
        (data.icdCode + data.icdCodeDesc).toLowerCase().includes((name.replace(/\s+/g, '').trim()).toLowerCase())
    );
    return arr.length ? arr : [{ icdCode: 'No ICD Code found', code: '' }];
  }

  filterInsuranceCompany(value: string, insuranceList: any[]) {
    const filteredList = insuranceList.filter(
      (data: any) => data.name.toLowerCase().includes(value.toLowerCase())
    );

    return filteredList.length ? filteredList : [{ name: 'No Insurance Company found', code: '' }];
  }



  filterReferral(value: string, referrals: any): any[] {
    const filteredReferrals = referrals.filter((referral: any) =>
      referral.referalSourceName.toLowerCase().includes(value.toLowerCase())
    );
    return filteredReferrals.length ? filteredReferrals : [{ referalSourceName: 'No Referral found' }];
  }

  filterState(value: string, stateList: any): any[] {
    const filteredStates = stateList.filter((state: any) =>
      state.stateName.toLowerCase().includes(value.toLowerCase())
    );
    return filteredStates.length ? filteredStates : [{ stateName: 'No state found' }];
  }

  filterDocument(value: string, documentList: any[]): any[] {
    const filteredDocuments = documentList.filter((document: any) =>
      document.documentName.toLowerCase().includes(value.toLowerCase())
    );
    return filteredDocuments.length ? filteredDocuments : [{ documentName: 'No document found' }];
  }


  filterTherapists(value: string, therapistList: any[]): any[] {
    const filteredTherapists = therapistList.filter((therapist: any) =>
      therapist.fullName.toLowerCase().includes(value.toLowerCase())

    );
    return filteredTherapists;
  }


  filterProviderList(value: string, providerList: any[]): any[] {
    const filteredProvider = providerList.filter((provider: any) =>
      provider.agencyMemberName.toLowerCase().includes(value.toLowerCase())

    );
    // return filteredProvider;
    return filteredProvider.length ? filteredProvider : [{ agencyMemberName: 'No Provider found', code: '' }];
  }

}
