import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro-screen',
  templateUrl: './registro-screen.component.html',
  styleUrls: ['./registro-screen.component.scss']
})
export class RegistroScreenComponent implements OnInit{

  public tipo:string = "registro-usuarios";
  //JSON para tipo de usuario
  public user:any ={};

  public isUpdate:boolean = false;
  public errors:any = {};
  //Banderas para el rol
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isMaestro:boolean = false;
  public isMateria:boolean = false;
  public editar: boolean = false;
  public tipo_user:string = "";
  //Info del usuario
  public idUser: Number = 0;
  public rol: string = "";

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
  ){}

  ngOnInit(): void {
      //Obtener de la URL el rol para saber cual editar
      if(this.activatedRoute.snapshot.params['rol'] != undefined){
        this.rol = this.activatedRoute.snapshot.params['rol'];
        console.log("Rol detect: ", this.rol);
      }
      //El if valida si existe un parámetro en la URL
      if(this.activatedRoute.snapshot.params['id'] != undefined){
        this.editar = true;
        //Asignamos a nuestra variable global el valor del ID que viene por la URL
        this.idUser = this.activatedRoute.snapshot.params['id'];
        console.log("ID User: ", this.idUser);
        //Al iniciar la vista obtiene el usuario por su ID
        this.obtenerUserByID();
      }

  }


  // TO DO AGREGAR LAS MATERIAS AL IF 

  //Función para obtener un solo usuario por su ID
  public obtenerUserByID(){
    if(this.rol == "administrador"){
      this.administradoresService.getAdminByID(this.idUser).subscribe(
        (response)=>{
          this.user = response;
          //Agregamos valores faltantes
          this.user.first_name = response.user.first_name;
          this.user.last_name = response.user.last_name;
          this.user.email = response.user.email;
          this.user.tipo_usuario = this.rol;
          this.isAdmin = true;
          //this.user.fecha_nacimiento = response.fecha_nacimiento.split("T")[0];
          console.log("Datos user: ", this.user);
        }, (error)=>{
          alert("No se pudieron obtener los datos del usuario para editar");
        }
      );
    }else if(this.rol == "maestro"){
      this.maestrosService.getMaestroByID(this.idUser).subscribe(
        (response)=>{
          this.user = response;
          //Agregamos valores faltantes
          this.user.first_name = response.user.first_name;
          this.user.last_name = response.user.last_name;
          this.user.email = response.user.email;
          this.user.tipo_usuario = this.rol;
          this.isMaestro = true;
          console.log("Datos maestro: ", this.user);
        }, (error)=>{
          alert("No se pudieron obtener los datos del usuario para editar");
        }
      );
    }else if(this.rol == "alumnos"){
      this.alumnosService.getAlumnoByID(this.idUser).subscribe(
        (response)=>{
          this.user = response;
          //Agregamos valores faltantes
          this.user.first_name = response.user.first_name;
          this.user.last_name = response.user.last_name;
          this.user.email = response.user.email;
          this.user.tipo_usuario = this.rol;
          this.isAlumno = true;
          console.log("Datos Alumno: ", this.user);
        }, (error)=>{
          alert("No se pudieron obtener los datos del usuario para editar");
        }
      );
    }
  }



  public radioChange(event: MatRadioChange) {

    if(event.value == "administrador"){
      this.isAdmin = true;
      this.tipo_user = "administrador"
      this.isAlumno = false;
      this.isMaestro = false;
      this.isMateria = false;
    }else if (event.value == "alumno"){
      this.isAdmin = false;
      this.isAlumno = true;
      this.tipo_user = "alumno"
      this.isMaestro = false;
      this.isMateria = false;

    }else if (event.value == "maestro"){
      this.isAdmin = false;
      this.isAlumno = false;
      this.isMaestro = true;
      this.tipo_user = "maestro"
      this.isMateria = false;

    }else if (event.value == "materia"){
      this.isAdmin = false;
      this.isAlumno = false;
      this.isMaestro = false;
      this.isMateria = true;
      this.tipo_user = "materia"
    }
  }

}
