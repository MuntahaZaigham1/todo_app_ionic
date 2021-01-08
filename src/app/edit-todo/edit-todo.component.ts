import { Component, OnInit } from '@angular/core';
import { ProductProviderService } from '../home/services/product-provider.service';
import { Product } from '../home/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {
  private state$: Observable<object>| undefined;
  id=null;
  editForm:FormGroup;
  products:Product[]=[];
  product={} as Product ;
  constructor(private todoService: ProductProviderService,
    private formBuilder: FormBuilder,public activatedRoute: ActivatedRoute,
    private router:Router) { 
      this.editForm = this.formBuilder.group({
        id:[''],
        name: [''],
        quantity: [''],
        price: ['']
      });
      //this.activatedRoute.params.subscribe( params => this.id=params['id'] );
      this.id=this.activatedRoute.snapshot.paramMap.get('id');
      console.log("id :",this.id);
      this.getProducts();
      this.updateid();
    }

  ngOnInit(): void {
    
  }
  updateid():void{
    this.products.forEach((element,index)=>{
      if(element.id==this.id) {
        this.product=element;
      } 
  });
  }
  updateP(product: FormGroup): void {
    this.todoService.updateProduct(product.value);
    this.router.navigate(['/home']);

  }
  get e() { return this.editForm.controls; }
  getProducts(): void {
    this.todoService.getProducts()
    .subscribe(products => this.products = products);
  }

}
