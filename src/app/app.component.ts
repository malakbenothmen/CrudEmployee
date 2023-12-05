import { Component,OnDestroy } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CRUD_Employee';
  employees = new Array<Employee>();
  newEmployee: Employee = new Employee(0, '', '');
  selectedEmployee: Employee | null = null;
  notificationCount =0;
  isEditDialogVisible = false;
  private destroy$ = new Subject<void>();

  private employeeSubscription: Subscription | undefined;

constructor(private empService:EmployeeService ) {

  empService.getEmployees().subscribe(response =>
 {
  this.employees = response.map(item =>
 {
  return new Employee(item.id, item.name, item.status );
});
});
}

onSubmit(): void {

 /* if (this.selectedEmployee) {
    // Si un employé est sélectionné, c'est une confirmation d'édition
    this.selectedEmployee.name = this.newEmployee.name;
    this.selectedEmployee.status = this.newEmployee.status;

    // Appelez le service pour mettre à jour l'employé dans la base de données
    this.empService.updateEmployee(this.selectedEmployee).subscribe(response => {
      console.log('Employee updated successfully', response);
    });
    // Réinitialisez le formulaire et l'employé sélectionné
    this.newEmployee = new Employee(0, '', '');
    this.selectedEmployee = null;
  } 
  else {*/

  // Créer un nouvel employé à partir des données du formulaire
  const newEmployee = new Employee(0, this.newEmployee.name, this.newEmployee.status);
  this.employees.push(newEmployee);
  this.notificationCount++;
  // Appelez le service pour ajouter l'employé à la base de données
  this.empService.addEmployee(newEmployee).subscribe(response => {
    console.log('Employee added successfully', response);
  });

  // Réinitialisez le formulaire
  this.newEmployee = new Employee(0, '', '');
}


closeEditDialog() {
  this.isEditDialogVisible = false;
}

editEmployee(employee: Employee): void {
  // Mettez en œuvre la logique pour l'édition de l'employé ici
  this.selectedEmployee = employee;
    this.newEmployee = { ...employee };
    this.isEditDialogVisible = true;
}

deleteEmployee(id: number): void {
  this.empService.deleteEmployee(id).subscribe(response => {
    console.log('Employee deleted successfully', response);

    // Mettez à jour la liste des employés après la suppression
    this.employees = this.employees.filter(emp => emp.id !== id);
  });
}

onSubmitedit()
{
  if (this.selectedEmployee) {
    // Si un employé est sélectionné, c'est une confirmation d'édition
    this.selectedEmployee.name = this.newEmployee.name;
    this.selectedEmployee.status = this.newEmployee.status;

    // Appelez le service pour mettre à jour l'employé dans la base de données
    this.empService.updateEmployee(this.selectedEmployee).subscribe(response => {
      console.log('Employee updated successfully', response);
    });
    // Réinitialisez le formulaire et l'employé sélectionné
    this.newEmployee = new Employee(0, '', '');
    this.selectedEmployee = null;
}
}
updateEmployee(): void {
  if (this.selectedEmployee) {
    // Appelez le service pour mettre à jour l'employé dans la base de données
    this.empService.updateEmployee(this.selectedEmployee).subscribe(response => {
      console.log('Employee updated successfully', response);
    });

    // Réinitialisez le formulaire et lemployé sélectionné
    this.newEmployee = new Employee(0, '', '');
    this.selectedEmployee = null;
    this.closeEditDialog();
  }
}



cancelEdit(): void {
  // Réinitialisez le formulaire et lemployé sélectionné
  this.newEmployee = new Employee(0, '', '');
  this.selectedEmployee = null;
}





ngOnInit() {
  // Souscrivez à l'observable d'ajout d'employés
  this.employeeSubscription = this.empService.employeeAdded$()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(newEmployee => {
      // Réagir à l'ajout d'un nouvel employé
      console.log('Nouvel employé ajouté:', newEmployee);

      // Mettez à jour la propriété notificationCount
      this.notificationCount++;
    });

  // Souscrivez à l'observable du nombre total d'employés
  this.empService.employeeCount$
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(count => {
      // Initialisez notificationCount avec le nombre total d'employés
      this.notificationCount = count;
    });
}

ngOnDestroy() {
  // Détruire les abonnements lors de la destruction du composant
  this.destroy$.next();
  this.destroy$.complete();
  if (this.employeeSubscription) {
    this.employeeSubscription.unsubscribe();
  }
}


}