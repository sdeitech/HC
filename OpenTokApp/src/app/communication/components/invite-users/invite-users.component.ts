import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize, fromEvent, map, tap } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { IAppResponseDataDto, SubSinkService, ToastMessageService } from '@core-services';

import { OpenTokService } from '../../services';
import { IInvitatedUserRequestDto, IUserForInvitationDto, ISearchOptionsVM, ITextValueDto } from '../../models';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrl: './invite-users.component.scss'
})
export class InviteUsersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchCtrl', { static: false }) searchCtrl!: ElementRef<HTMLInputElement>;

  private readonly subSink = new SubSinkService();
  private readonly appointmentId: number = 0;

  isLoading: boolean = false;
  searchOptions!: ISearchOptionsVM;
  userForInvitations: IUserForInvitationDto[] = [];
  selectedUserForInvitation: IUserForInvitationDto | null | undefined = null;
  filteredRecords: ITextValueDto[] = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private readonly _inputData: { appointmentId: number } | null | undefined,
    private readonly _dialogRef: MatDialogRef<InviteUsersComponent>,
    private readonly _openTokService: OpenTokService,
    private readonly _toastMessageService: ToastMessageService,
  ) {
    if (this._inputData && this._inputData.appointmentId > 0)
      this.appointmentId = this._inputData.appointmentId;
  }

  ngOnInit(): void {
    if (!this._inputData || !this._inputData.appointmentId) {
      this._toastMessageService
        .add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Missing appointment.'
        });

      this.onClose();
    }
  }

  ngAfterViewInit(): void {
    this.initSearchOptions();
    this.registerInputEvent();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  onSendInvitation() {
    if (!this.selectedUserForInvitation) {
      this._toastMessageService
        .add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'User not selected.'
        });

      return;
    }

    const model: IInvitatedUserRequestDto = {
      appointmentId: this.appointmentId,
      userForInvitations: [this.selectedUserForInvitation]
    };

    this.subSink.sink = this._openTokService
      .sendInvitation<IAppResponseDataDto<IInvitatedUserRequestDto>>(model)
      .subscribe(response => {
        if (!response.isSuccess) {
          this._toastMessageService
            .add({
              severity: 'warn',
              summary: 'Warning',
              detail: response.message
            });

          return;
        }

        this._toastMessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Invitation sent successfully.'
        });

        this.selectedUserForInvitation = null;

        window.setTimeout(() => {
          this._dialogRef.close();
        });
      });
  }

  onClose() {
    this._dialogRef.close();
  }

  onClear() {
    this.selectedUserForInvitation = null;
  }

  onAutoSelect = (event: MatAutocompleteSelectedEvent): void => {
    const value = Number(event.option.value);
    this.selectedUserForInvitation = this.userForInvitations.find(x => x.userId === value);

    if (this.searchCtrl?.nativeElement)
      this.searchCtrl.nativeElement.value = '';
  }

  private initSearchOptions = (): void => {
    this.searchOptions = {
      searchCallback: (searchText: string) => this._openTokService.getUsersForInvitition(this.appointmentId, searchText),
      transform: (data: any) => this.transform(data)
    };
  }

  private transform = (response: any): ITextValueDto[] => {
    const model: IAppResponseDataDto<IUserForInvitationDto[]> = response;
    this.userForInvitations = model.data || [];
    return model.data.map(x => ({ text: `${x.userFullName} (${x.email}) [${x.roleName}]` || '', value: (x.userId || 0).toString() }));
  }

  private registerInputEvent = (): void => {
    const searchCtrlInput = this.searchCtrl?.nativeElement;

    if (searchCtrlInput) {
      const observable$ = fromEvent(searchCtrlInput, 'input');

      this.subSink.sink = observable$
        .pipe(
          map(event => (event?.target as HTMLInputElement)?.value),
          debounceTime(500),
          distinctUntilChanged(),
          tap(() => {
            this.filteredRecords = [];
            this.isLoading = true;
          })
        ).subscribe(value => {
          value = (value || '').trim();

          if (!value)
            this.isLoading = false;
          else
            this.subSink.sink = this.searchOptions.searchCallback(value)
              .pipe(finalize(() => { this.isLoading = false; }))
              .subscribe((data: any) => {
                this.filteredRecords = this.searchOptions.transform(data) || [];
              });
        });
    }
  }
}
