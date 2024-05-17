import { Component,Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MatDialog } from '@angular/material/dialog';
import{EditarUserComponent}from 'src/app/modals/editar-user/editar-user.component'

declare var $:any;

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit{

  constructor(
    
    private router: Router,
    private location: Location,
    private materiasService: MateriasService,
    private facadeService: FacadeService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog

    
  ) { }
  
  ngOnInit(){
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      console.log("ID de materia: ", this.idMateria);
      //Al iniciar la vista asignamos los datos del user
      this.materia = this.datos_materia;
      this.obtenerMateriaByID();
    }else{
      this.materia = this.materiasService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("MATERIA: ", this.materia);

    
  }

  @Input() datos_materia: any = {};

  public materia:any= {};
  public errors:any={};
  public editar:boolean = false;
  public idMateria: number = 0;
  public token: string = "";
  public selectedCarrera : string="";
  public selectedValuedia: String = "";
 

//esto es para el checkbox de los dias 
  public valoresCheckbox: any = [];
  public dias_json: any [] = [];

//esto es para el select 

public programa_educativo: any[] = [
  {value: '1', viewValue: 'Ingeniería en Ciencias de la Computación '},
  {value: '2', viewValue: 'Licenciatura en Ciencias de la Computación'},
  {value: '3', viewValue: 'Ingeniería en Tecnologías de la Información'},
];

public dias:any[]= [
  {value: '1', nombre: 'Lunes'},
  {value: '2', nombre: 'Martes'},
  {value: '3', nombre: 'Miercoles'},
  {value: '4', nombre: 'Jueves'},
  {value: '5', nombre: 'Viernes'},
  {value: '6', nombre: 'Sabado'},
];



public obtenerMateriaByID(){
  this.materiasService.getMateriaByID(this.idMateria).subscribe(
    (response)=>{
      this.materia = response;
      this.materia.hora_inicio = response.hora_inicio.split ("SS")[0];
      console.log("Datos Materia: ", this.materia);
    }, (error)=>{
      alert("No se pudieron obtener los datos de la materia para editar");
    }
  );
}

public changeSelect(event:any){
  console.log(event.value);
  this.materia.programa_educativo = event.value;
}

public checkboxChange(event:any){
  console.log("Evento dias: ", event);
  if(event.checked){
    this.materia.dias_json.push(event.source.value)
  }else{
    console.log(event.source.value);
    this.materia.dias_json.forEach((dias, i) => {
      if(dias == event.source.value){
        this.materia.dias_json.splice(i,1);
      }
    });
  }
  console.log("Array de dias: ", this.materia);
}

public revisarSeleccion(nombre: string){
  if(this.materia.dias_json){
    var busqueda = this.materia.dias_json.find((element)=>element==nombre);
    if(busqueda != undefined){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}


public regresar(){
  this.location.back();
}


public registrarM(){
  //validar si hay errores
  this.errors = [];

  this.errors = this.materiasService.validarMateria(this.materia, this.editar);
  console.log("Validando materia: ");
  if(!$.isEmptyObject(this.errors)){
    //no hubo errores 
    return false;
  }
  //llamado a la funcion del servicio para registarse 
  this.materiasService.registrarMat(this.materia).subscribe(
    (response)=>{
      alert("materia registrada correctamente");
      console.log("Materia registrado: ", response);
      this.router.navigate(["home"]);
    }, (error)=>{
      alert("No se pudo registrar la Materia");
      console.log(error);
    }
  );
}

public actualizar(){
  //Validación
  this.errors = [];

  this.errors = this.materiasService.validarMateria(this.materia, this.editar);
  if(!$.isEmptyObject(this.errors)){
    return false;
  }
  console.log("Pasó la validación");
  const dialogRef = this.dialog.open(EditarUserComponent,{ //se llama al modal para confirmar eliminar
    data: {id: this.idMateria}, //Se pasan valores a través del componente
    height: '268px',
    width: '328px',
  });
    dialogRef.afterClosed().subscribe(result => {
    if(result.isDelete){
      this.materiasService.editarMateria(this.materia).subscribe(
        (response)=>{
          alert("Materia editada correctamente");
          console.log("Materia editada: ", response);
          //Si se editó, entonces mandar al home
          this.router.navigate(["home"]);
        }, (error)=>{
          alert("No se pudo editar la materia");
        }
      );
    }else{
      alert("No se elimino materia ");
      console.log("No se eliminó la materia");
    }
  });
  
}


}
