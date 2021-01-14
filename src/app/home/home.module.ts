import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ProductProviderService } from './services/product-provider.service';
import { DatabaseService } from './services/database.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    Ng2SearchPipeModule,
    NgxDatatableModule

  ],
  declarations: [HomePage],
  providers: [
    DatabaseService

  ]
})
export class HomePageModule {}
