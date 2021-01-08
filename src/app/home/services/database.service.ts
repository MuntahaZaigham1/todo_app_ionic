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
const { CapacitorSQLite, Device } = Plugins;
 
const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'db_name';
 
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
        this.initializeDB();


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
    async testSQLitePlugin(): Promise<void> {
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
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY NOT NULL,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          FirstName TEXT,
          age INTEGER,
          MobileNumber TEXT
        );
        PRAGMA user_version = 1;
        COMMIT TRANSACTION;
        `;
        var retExe: any = await this.sqlite.execute({statements:sqlcmd});
        console.log('retExe ',retExe.changes.changes);
        // Insert some Users
        sqlcmd = `
        BEGIN TRANSACTION;
        DELETE FROM users;
        INSERT INTO users (name,email,age) VALUES ("Whiteley","Whiteley.com",30);
        INSERT INTO users (name,email,age) VALUES ("Jones","Jones.com",44);
        COMMIT TRANSACTION;
        `;
        retExe = await this.sqlite.execute({statements:sqlcmd});
        // will print the changes  2 in that case
        console.log('retExe ',retExe.changes.changes);
        // Select all Users
        sqlcmd = "SELECT * FROM users";
        var retSelect: any = await this.sqlite.query({statement:sqlcmd,values:[]});
        console.log('retSelect.values.length ',retSelect.values.length);
        const row1: any = retSelect.values[0];
        console.log("row1 users ",JSON.stringify(row1))
        const row2: any = retSelect.values[1];
        console.log("row2 users ",JSON.stringify(row2))

        // Insert a new User with SQL and Values

        sqlcmd = "INSERT INTO users (name,email,age) VALUES (?,?,?)";
        let values: Array<any>  = ["Simpson","Simpson@example.com",69];
        var retRun: any = await this.sqlite.run({statement:sqlcmd,values:values});
        console.log('retRun ',retRun.changes.changes,retRun.changes.lastId);

        // Select Users with age > 35
        sqlcmd = "SELECT name,email,age FROM users WHERE age > ?";
        retSelect = await this.sqlite.query({statement:sqlcmd,values:["35"]});
        console.log('retSelect ',retSelect.values.length);

        // Execute a Set of raw SQL Statements
        let set: Array<any>  = [
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Blackberry","Peter","Blackberry@example.com",69,"4405060708"]
          },
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Jones","Helen","HelenJones@example.com",42,"4404030201"]
          },
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Davison","Bill","Davison@example.com",45,"4405162732"]
          },
          { statement:"INSERT INTO users (name,FirstName,email,age,MobileNumber) VALUES (?,?,?,?,?);",
            values:["Brown","John","Brown@example.com",35,"4405243853"]
          },
          { statement:"UPDATE users SET age = ? , MobileNumber = ? WHERE id = ?;",
            values:[51,"4404030237",2]
          }
        ];
        result = await this.sqlite.executeSet({set:set});
        console.log("result.changes.changes ",result.changes.changes);
        if(result.changes.changes != 5) return;

      } else {
        console.log("Error: Open database failed");
        return;
      }
   }
    
 
  // private async setupDatabase() {
  //   const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });
  //   console.log("setupdb dbsetiupdone:",dbSetupDone);

  //   if (!dbSetupDone.value) {
  //     this.downloadDatabase();

  //   } else {
  //     this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
  //     await CapacitorSQLite.open({ database: this.dbName });
  //     this.dbReady.next(true);
  //   }
  // }
 
  // Potentially build this out to an update logic:
  // Sync your data on every app start and update the device DB
  // private downloadDatabase(update = false) {


  //   this.http.get('./assets/db.json').subscribe(async (jsonExport: JsonSQLite) => {
  //     console.log("downloadDatabase > jsonExport:",jsonExport);
  //     const jsonstring = JSON.stringify(jsonExport);
  //     console.log("downloadDatabase > jsonstring:",jsonstring);
  //     const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });
  //     console.log("downloadDatabase > isValid:",isValid);
  //     console.log("downloadDatabase > isValid.result :",isValid.result);
      
  //     if (!isValid.result) {
  //       this.dbName = jsonExport.database;
  //       await Storage.set({ key: DB_NAME_KEY, value: this.dbName });
  //       //await CapacitorSQLite.importFromJson({ jsonstring });
  //       let statement = 'CREATE TABLE IF NOT EXISTS Products(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price INTEGER, quantity INTEGER);';
  //     await CapacitorSQLite.run({statement });
  //     statement='INSERT INTO Products (name, price, quantity) VALUES (dolls,23, 45),(dolls1,23, 45),(dolls3,23, 45);'
  //    await  CapacitorSQLite.run({statement });
  //       await Storage.set({ key: DB_SETUP_KEY, value: '1' });
        
  //       // Your potential logic to detect offline changes later
  //       if (update) {
  //         await CapacitorSQLite.createSyncTable();
  //       } else {
  //         await CapacitorSQLite.setSyncDate({ syncdate: '' + new Date().getTime() })
  //       }
  //       this.dbReady.next(true);
  //     } else {
  //       console.log("downloadDatabase > jsonstring > error");
  //     }
  //   });
  // }
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
   
  async getProductById(id) {
    const statement = `SELECT * FROM products LEFT JOIN vendors ON vendors.id=products.vendorid WHERE products.id=${id} ;`;
    return (await CapacitorSQLite.query({ statement, values: [] })).values[0];
  }
   
  getDatabaseExport(mode) {
    return CapacitorSQLite.exportToJson({ jsonexportmode: mode });
  }
   
  addProduct(product:Product) {
    return this.dbReady.pipe(
      switchMap( isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
         
          // Select all Users
          const statement = `INSERT INTO products (name, price, quantity,) VALUES ('${product.name}', ${product.price}, ${product.quantity});`;
          var retSelect: any = this.sqlite.run({ statements: statement })
        // console.log('retSelect.values.length ',retSelect.values.length);
        // const row1: any = retSelect.values[0];
        // console.log("row1 users ",JSON.stringify(row1))
        // const row2: any = retSelect.values[1];
        // console.log("row2 users ",JSON.stringify(row2))
        return from(retSelect);
        }
      })
    )
    // const statement = `INSERT INTO products (name, price, quantity,) VALUES ('${product.name}', ${product.price}, ${product.quantity});`;
    // console.log("prod",product);
    // return from(this.sqlite.run({ statements: statement })) ;
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