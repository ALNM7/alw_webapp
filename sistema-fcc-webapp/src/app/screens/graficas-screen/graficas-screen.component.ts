import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent {
   //Agregar chartjs-plugin-datalabels
  //Variables
  public total_user: any = {};
  //Histograma
  lineChartData: any;
  lineChartOption = { 
    responsive:false 
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData: any;
  
  barChartOption = { responsive: false };
  
  barChartPlugins = [DatalabelsPlugin];
  

  //Circular
  pieChartData: any;
  pieChartOption = { responsive: false };
  pieChartPlugins = [DatalabelsPlugin];

  // Doughnut
  doughnutChartData: any;
  doughnutChartOption = { responsive: false };
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService
  ){}

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response: any) => {
        // Graficas con datos dinamicos
        this.lineChartData = {
          labels: ["Administradores", "Alumnos", "Maestros"],
          datasets: [{
            data: [response.admins, response.alumnos, response.maestros],
            label: 'Registro de materias',
            backgroundColor: ['#F88406', '#FCFF44', '#31E7E7']
          }]
        };

        this.barChartData = {
          labels: ["Administradores", "Alumnos", "Maestros"],
          datasets: [{
            data: [response.admins, response.alumnos, response.maestros],
            label: 'Registro de materias',
            backgroundColor: ['#F88406', '#FCFF44', '#31E7E7']
          }]
        };

        this.pieChartData = {
          labels: ["Administradores", "Alumnos", "Maestros"],
          datasets: [{
            data: [response.admins, response.alumnos, response.maestros],
            label: 'Registro de usuarios',
            backgroundColor: ['#F88406', '#FCFF44', '#31E7E7']
          }]
        };

        this.doughnutChartData = {
          labels: ["Administradores", "Alumnos", "Maestros"],
          datasets: [{
            data: [response.admins, response.alumnos, response.maestros],
            label: 'Registro de usuarios',
            backgroundColor: ['#F88406', '#FCFF44', '#31E7E7']
          }]
        };

        console.log("Total usuarios: ", this.total_user);
      },
      (error) => {
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }
  


}
