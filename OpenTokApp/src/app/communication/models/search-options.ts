import { HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { ITextValueDto } from "./text-value";

export interface ISearchOptionsVM {
    searchCallback: (searchTerm: string) => Observable<HttpResponse<any> | ITextValueDto[]>,
    transform: (value: any) => ITextValueDto[]
}