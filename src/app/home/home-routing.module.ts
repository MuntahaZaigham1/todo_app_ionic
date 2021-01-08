import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { EditTodoComponent } from '../edit-todo/edit-todo.component';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  { path: 'add', component: AddTodoComponent },
  { path: 'edit/:id', component: EditTodoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
