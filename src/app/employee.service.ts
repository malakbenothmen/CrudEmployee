import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees';
  private employeeAddedSubject = new Subject<Employee>();

  private employeeCountSubject = new Subject<number>();
  employeeCount$ = this.employeeCountSubject.asObservable();

  constructor(private http: HttpClient ) { }

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap(employees => {
        this.employeeCountSubject.next(employees.length);
      })
    );
  }
public addEmployee(employee: Employee): Observable<Employee> {
  return this.http.post<Employee>(this.apiUrl, employee);
}
public updateEmployee(employee: Employee): Observable<Employee> {
  const url = `${this.apiUrl}/${employee.id}`; // L'URL spécifique pour l'employé à mettre à jour
  return this.http.put<Employee>(url, employee);
}
public deleteEmployee(id: number): Observable<Employee> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.delete<Employee>(url);
}

addEmployeeWithEvent(employee: Employee): Observable<Employee> {
  return this.addEmployee(employee).pipe(
    tap(newEmployee => this.employeeAddedSubject.next(newEmployee))
  );
}

// Observable pour écouter les ajouts d'employés
employeeAdded$(): Observable<Employee> {
  return this.employeeAddedSubject.asObservable();
}

}

