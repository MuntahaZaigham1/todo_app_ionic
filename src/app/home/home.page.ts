import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { Product } from './product';
import { DatabaseService } from './services/database.service';
import { ProductProviderService } from './services/product-provider.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private productProvider: ProductProviderService,
    private databaseService: DatabaseService,
    private loadingCtrl: LoadingController
    
  ) {
    this.initializeApp();
    this.loadProducts();
  }
  async initializeApp() {
    this.platform.ready().then(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.databaseService.init();
      this.databaseService.dbReady.subscribe(isReady => {
        console.log("db isReady:",isReady);
        if (isReady) {
          loading.dismiss();
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        }
      });
    });
  }

  
  selectedProduct: Product = {
    id: 1,
    name: 'shampoo',
    price: 20,
    quantity:2

  };
  products:Product[]= [];
  
 
  onSelect(product: Product): void {
      this.selectedProduct = product;
      //this.todoService.addProduct(this.selectedProduct);
    }
    Delete(product: Product): void {
      console.log('inside delete',product);
      this.databaseService.deleteProduct(product.id);
      const index=this.products.indexOf(product);
      this.products.splice(index,1);
      console.log('outside delete');

    }
  getProducts(): void {
    this.productProvider.getProducts()
    .subscribe(products => this.products = products);
    
  }
  temp:any;
  loadProducts() {
    this.databaseService.getProductList().subscribe(res => {
      console.log("outside res> res ", res);
      this.temp=res;
      this.products=this.temp.values;
      console.log("outside res> products ", this.products);

    });
  }
  
  ngOnInit(): void {
    
    //this.getProducts();
    
    
  }
}
