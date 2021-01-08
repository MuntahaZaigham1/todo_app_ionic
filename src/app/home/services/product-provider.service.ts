import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PRODUCTS } from '../mock-products';
import { Product } from '../product';

@Injectable({
  providedIn: 'root'
})
export class ProductProviderService {
  constructor() { }
  prods=PRODUCTS;
  getProducts(): Observable <Product[]> {
    return of(this.prods);
  }
  addProduct(pro: Product): void{
    console.log('before',this.prods);
    console.log(pro);
    this.prods.push(pro);
    
    console.log(this.prods);
    
    
  }
  deleteProduct(num:number): void{
    this.prods.forEach((element,index)=>{
        if(element.id==num) {
          this.prods.splice(index, 1);
        } 
    });
     
  }
  
  updateProduct(prod:Product): void{
    this.prods.forEach((element,index)=>{
      if(element==prod) {
        this.prods[index]=prod;
      } 
  });
  }
  
}
