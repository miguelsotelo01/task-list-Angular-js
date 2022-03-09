import { Injectable } from '@angular/core';
import{HttpClient, HttpHandler} from '@angular/common/http';
import { from, Observable, observable, of } from 'rxjs';
import { Task } from '../components/Task';
import { TASKS } from '../components/mock-task';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
private apiUrl= 'http://localhost:5000/tasks'
  constructor(private http:HttpClient) { }
  getTasks(): Observable <Task[]>{
  return this.http.get<Task[]>(this.apiUrl)
  }
}
