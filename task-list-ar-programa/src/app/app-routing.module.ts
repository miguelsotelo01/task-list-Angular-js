import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { AboutComponent } from './components/about/about.component'; // Importar el componente

const routes: Routes = [
  // Ruta por defecto (la lista de tareas)
  { path: '', component: TasksComponent },
  // Ruta para el About
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
