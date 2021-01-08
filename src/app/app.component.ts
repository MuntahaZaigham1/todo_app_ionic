import { Component } from '@angular/core';

import { LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { DatabaseService } from './home/services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [ DatabaseService ]
})
export class AppComponent {
  constructor(
    
  ) {
   
  }

  
  
  
}
