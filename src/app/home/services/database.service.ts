import { Injectable } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
 
import { JsonSQLite } from '@capacitor-community/sqlite';
import { async } from '@angular/core/testing';
import { Product } from '../product';
const { CapacitorSQLite, Device, Storage } = Plugins;
 
const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'prod';
 
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  dbReady = new BehaviorSubject(false);
  dbName = '';
  
  sqlite: any;
  platform: string;
  isPermission: boolean = true;

  CREATE_PRODUCTS_TABLE =
  "CREATE TABLE IF NOT EXISTS products (\
        id CHAR(37) PRIMARY KEY,\
        name TEXT,\
        price INTEGER,\
        quantity INTEGER;";

  constructor(private http: HttpClient, private alertCtrl: AlertController    ) {
  
   }
  
 
  async init(): Promise<void> {
    this.platform = Capacitor.platform;
    this.sqlite = CapacitorSQLite;
    if (this.platform === 'android') {
      const handlerPermissions = this.sqlite.addListener(
        'androidPermissionsRequest', async (data:any) => {
    if (data.permissionGranted === 1) {
      this.isPermission = true;
    } else {
      this.isPermission = false;
    }
  });
  try {
    this.sqlite.requestPermissions();
    await this.setupDatabase();
  } catch (e) {
    console.log('Error requesting permissions!' + JSON.stringify(e));
    }
    
  }
    
    };
    async initializeDB(): Promise<void> {
      if(!this.isPermission) {
        console.log("Android permissions not granted");
        return;
      }
      let result:any = await this.sqlite.open({database:"testsqlite"});
      const retOpenDB = result.result;
      if(retOpenDB) {
        // Create Tables if not exist
        let sqlcmd: string = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT UNIQUE NOT NULL,
          quantity INTEGER,
          price INTEGER
        );
        PRAGMA product_version = 1;
        COMMIT TRANSACTION;
        `;
        var retExe: any = await this.sqlite.execute({statements:sqlcmd});
        console.log('retExe ',retExe.changes.changes);
         // Insert some Users
         sqlcmd = `
         BEGIN TRANSACTION;
         INSERT INTO products (name,quantity,price) VALUES ("Whiteley",45,30);
         INSERT INTO products (name,quantity,price) VALUES ("Jones",34,44);
         COMMIT TRANSACTION;
         `;
         retExe = await this.sqlite.execute({statements:sqlcmd});
         // will print the changes  2 in that case
         console.log('retExe ',retExe.changes.changes);
         this.dbReady.next(true);

      }
      else {
        console.log("Error: Open database failed");
        return;
      }

    }
    
   
    
 
  private async setupDatabase() {
    const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });
    console.log("setupdb dbsetiupdone:",dbSetupDone);

    if (!dbSetupDone.value) {
      this.downloadDatabase();

    } else {
      this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
      await this.sqlite.open({ database: this.dbName });
      this.dbReady.next(true);
    }
  }
 
  // Potentially build this out to an update logic:
  // Sync your data on every app start and update the device DB
  private async downloadDatabase(update = false) {

        this.dbName = 'prod';
        await Storage.set({ key: DB_NAME_KEY, value: this.dbName });
        //await CapacitorSQLite.importFromJson({ jsonstring });
        let result:any = await this.sqlite.open({database:this.dbName});
      const retOpenDB = result.result;
      if(retOpenDB) {
        let sqlcmd: string = `
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT UNIQUE NOT NULL,
          quantity INTEGER,
          price INTEGER
        );
        PRAGMA product_version = 1;
        COMMIT TRANSACTION;
        `;
        var retExe: any = await this.sqlite.execute({statements:sqlcmd});
        console.log('retExe ',retExe.changes.changes);
         // Insert some Users
         sqlcmd = `
         BEGIN TRANSACTION;
         INSERT INTO products (name,quantity,price) VALUES ("Whiteley",45,30);
         INSERT INTO products (name,quantity,price) VALUES ("Jones",34,44);
         COMMIT TRANSACTION;
         `;
         retExe = await this.sqlite.execute({statements:sqlcmd});
         // will print the changes  2 in that case
         console.log('retExe ',retExe.changes.changes);
        await Storage.set({ key: DB_SETUP_KEY, value: '1' });
        
        // Your potential logic to detect offline changes later
        
        this.dbReady.next(true);
      }
       
    
  }
  getProductList() {
    return this.dbReady.pipe(
      switchMap( isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
         
          // Select all Users
        const sqlcmd = "SELECT * FROM products";
        var retSelect: any = this.sqlite.query({statement:sqlcmd,values:[]});
        // console.log('retSelect.values.length ',retSelect.values.length);
        // const row1: any = retSelect.values[0];
        // console.log("row1 users ",JSON.stringify(row1))
        // const row2: any = retSelect.values[1];
        // console.log("row2 users ",JSON.stringify(row2))
        return from(retSelect);
        }
      })
    )
  }
   
  getProductById(id) {
     // Select Users with age > 35
     return this.dbReady.pipe(
      switchMap( async isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
     let sqlcmd = "SELECT id,name,quantity,price FROM products WHERE id = ?";
     var retSelect = await this.sqlite.query({statement:sqlcmd,values:[id]});
     console.log('retSelect ',retSelect.values.length);
    return (await retSelect.values);
        }}));
  }
   
  getDatabaseExport(mode) {
    return CapacitorSQLite.exportToJson({ jsonexportmode: mode });
  }

   
  addProduct(product:Product) {
    return this.dbReady.pipe(
      switchMap( async isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          console.log("here in addprod");
         const sqlcmd = "INSERT INTO products (name, price, quantity) VALUES (?,?,?)";
        let values: Array<any>  = [product.name,product.price,product.quantity];
        var retRun: any = await this.sqlite.run({statement:sqlcmd,values:values});
        console.log('retRun ',retRun.changes.changes,retRun.changes.lastId);
      
        return retRun.changes.changes;
        }
      })
    )
    // const statement = `INSERT INTO products (name, price, quantity,) VALUES ('${product.name}', ${product.price}, ${product.quantity});`;
    // console.log("prod",product);
    // return from(this.sqlite.run({ statements: statement })) ;
  }
   async updateProduct(product:Product) {
    
      

         const sqlcmd = "UPDATE products SET name = ? , price = ? , quantity = ? WHERE id = ?;";
        let values: Array<any>  = [product.name,product.price,product.quantity,product.id];
        var retRun: any = await this.sqlite.run({statement:sqlcmd,values:values});
        console.log('retRun ',retRun.changes.changes,retRun.changes.lastId);
      
        return retRun.changes.changes;
        
     
    
  }
   
  deleteProduct(productId) {
    const statement = `DELETE FROM products WHERE id = ${productId};`;
    return this.sqlite.execute({ statements: statement });
  }
   
  // // For testing only..
  // async deleteDatabase() {
  //   const dbName = await Storage.get({ key: DB_NAME_KEY });
  //   await Storage.set({ key: DB_SETUP_KEY, value: null });
  //   return CapacitorSQLite.deleteDatabase({ database: dbName.value });
  // }
}