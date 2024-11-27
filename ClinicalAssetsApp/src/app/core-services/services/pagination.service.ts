import { Injectable } from "@angular/core";

import { IPageFilterDto, IPagedResultDto } from "../models";

@Injectable({
    providedIn: 'root',
})
export class PaginationService {
    private readonly _PageSizeOptions: number[] = [5, 10, 25, 100];

    getDefaultPageOptions(): number[] {
        return this._PageSizeOptions;
    }

    getDefaultPageFilter(sortColumn: string = '', sortOrder: string = 'ASC'): IPageFilterDto {
        return {
            pageNumber: 1,
            pageSize: this._PageSizeOptions[0],
            sortColumn: sortColumn,
            sortOrder: sortOrder,
            searchText: '',
        };
    }
    getDefaultPageSizeFilter(sortColumn: string = '', sortOrder: string = 'ASC', pageSize: number = 5): IPageFilterDto {
        return {
            pageNumber: 1,
            pageSize: pageSize,
            sortColumn: sortColumn,
            sortOrder: sortOrder,
            searchText: '',
        };
    }

    getDefaultPagedResultObject<TModel>(): IPagedResultDto<TModel> {
        return {
            records: [],
            pageNumber: 1,
            pageSize: this._PageSizeOptions[0],
            totalRecords: 0,
            isFirstPage: true,
            isLastPage: true
        };
    }
}