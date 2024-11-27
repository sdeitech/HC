import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AppCacheService } from 'src/app/services';
import { JwtTokenServiceService } from 'src/app/services/jwt-token-service.service';

@Component({
  selector: 'app-clinical-assets',
  templateUrl: './clinical-assets.component.html',
  styleUrls: ['./clinical-assets.component.scss'],
  providers: [DialogService, MessageService]
})
export class ClinicalAssetsComponent implements OnInit, OnDestroy {
  isPopulatingMasters: boolean = false;
  populatingMasterSubscription: Subscription;

  constructor(
    private readonly _appCacheService: AppCacheService,
    private readonly jwtService: JwtTokenServiceService
  ) { }

  ngOnInit(): void {
    this.populatingMasterSubscription = this._appCacheService.populatingMasterData$
      .subscribe(result => {
        this.isPopulatingMasters = result;
      });

    this._appCacheService.populateMasterData();
  }

  ngOnDestroy() {
    this.populatingMasterSubscription?.unsubscribe();
  }
}