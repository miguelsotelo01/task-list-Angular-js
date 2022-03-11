import { Injectable } from '@angular/core';
import{HttpClient, HttpHandler} from '@angular/common/http';
import { from, Observable, observable, of } from 'rxjs';
import { Task } from '../components/Task';
import { TASKS } from '../components/mock-task';

const httpOptions={
  Headers: new Headers({
    'content-type':'aplication/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
private apiUrl= 'http://localhost:5000/tasks'
  constructor(private http:HttpClient) { }
  getTasks(): Observable <Task[]>{
  return this.http.get<Task[]>(this.apiUrl)
  }
  deleteTask(task:Task):Observable<Task>{
    const url=`${this.apiUrl}/${task.id}`
    return this.http.delete<Task>(url)
  }
  updateTaskReminder(task:Task):Observable<Task>{
    const url=`${this.apiUrl}/${task.id}`
    return this.http.put<Task>(url,task,)
  }
  addTask(task:Task):Observable<Task>{
return this.http.post<Task>(this.apiUrl,task)
  }
}
