import { Component, OnInit } from '@angular/core';
import { ProductProviderService } from '../home/services/product-provider.service';
import { Product } from '../home/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators'
import { DatabaseService } from '../home/services/database.service';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {
  private state$: Observable<object>| undefined;
  id=null;
  editForm:FormGroup=null;
  products:Product[]=[];
  product={} as Product ;
  constructor(private todoService: ProductProviderService,
    private formBuilder: FormBuilder,public activatedRoute: ActivatedRoute,
    private router:Router, private databaseService :DatabaseService) { 
      this.editForm = this.formBuilder.group({
        id:[''],
        name: [''],
        quantity: [''],
        price: ['']
      });
      
    }

  ngOnInit(): void {
    this.id=this.activatedRoute.snapshot.paramMap.get('id');
    console.log("id :",this.id);
    this.databaseService.init();
    this.updateid();
  }
  updateid():void{
    this.databaseService.getProductById(this.id).subscribe(res=>{
      console.log('response',res);
      this.product=res[0];
    })
  }
  onSubmit(prod: Product): void {
    console.log("product in form group",prod);

    this.databaseService.updateProduct(prod).then(res=>{
      const temp=res;
      if(temp>=1){
        alert('Your product has been updated');
        this.router.navigate(['/home']);
      }
     
    });

  }
  get e() { return this.editForm.controls; }
  getProducts(): void {
    this.todoService.getProducts()
    .subscribe(products => this.products = products);
  }

}
