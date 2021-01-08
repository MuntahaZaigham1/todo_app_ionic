import { Component, OnInit } from '@angular/core';
import { ProductProviderService } from '../home/services/product-provider.service';
import { Product } from '../home/product';
import { FormBuilder, FormGroup } from '@angular/forms';

import { PRODUCTS } from '../home/mock-products';
import { Router, RouterEvent } from '@angular/router';
import { DatabaseService } from '../home/services/database.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  checkoutForm:FormGroup;
  
  constructor(private todoService: ProductProviderService,
    private formBuilder: FormBuilder,
    private router : Router,
    private databaseService: DatabaseService
    ) { 

      this.checkoutForm = this.formBuilder.group({
        id:[''],
        name: [''],
        quantity: [''],
        price: ['']
      });
      

    }

  ngOnInit(): void {
    
  }
  
  
  get f() { return this.checkoutForm.controls; }
  

  
  pro={} as Product;

  onSubmit() {
    // Process checkout data here
    
    this.pro['id']=this.f.id.value;
    this.pro['name']=this.f.name.value;
    this.pro['quantity']=this.f.quantity.value;
    this.pro['price']=this.f.price.value;
    this.databaseService.addProduct(this.pro);
        
          alert('Your product has been submitted');
          this.router.navigate(['/home']);
        
      
    console.warn('Your order has been submitted', this.pro.name);

    this.pro={} as Product;
    this.checkoutForm.reset();

    
  }
}

