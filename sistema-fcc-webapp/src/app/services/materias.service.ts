import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMateria(){
    return {
      'nrc': '',
      'nombre_materia': '',
      'seccion': '',
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa_educativo': '',
      'dias_json': []
    }
  }

  public getMateriaByID(idMateria: number){
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`,httpOptions);
  }

  public registrarMat(data:any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/materias/`, data, httpOptions); //llama al back
  }

  public editarMateria (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/materias-edit/`, data, {headers:headers});
  }

  public eliminarMateria (idMateria: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/materias-edit/?id=${idMateria}`,{headers:headers});
  }
  
  public obtenerListaMaterias (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token})
    return this.http.get<any>(`${environment.url_api}/materias1/`, {headers:headers});
  }
  
  public validarMateria(data:any, editar:boolean){
    console.log("validando materia", data);
    let error: any=[]; 

    if(!this.validatorService.required(data["nrc"])){ //required es para campo requerido y el numeric para cuando 
      error["nrc"] = this.errorService.required;      // solo se admiten numeros
    }else if(!this.validatorService.numeric(data["nrc"])){
      alert("El formato del NRC es solo números");
    }

    if(!this.validatorService.required(data["nombre_materia"])){
      error["nombre_materia"] = this.errorService.required; 
    }

    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required; 
    }else if(!this.validatorService.numeric(data["seccion"])){
      alert("El formato de la Seccion es solo números");
    }
    if(!this.validatorService.required(data["hora_inicio"])){
      error["hora_inicio"] = this.errorService.required; 
    }

    if(!this.validatorService.required(data["hora_fin"])){
      error["hora_fin"] = this.errorService.required; 
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required; 
    }

    if(!this.validatorService.required(data["programa_educativo"])){
      error["programa_educativo"] = this.errorService.required; 
    }
    
    if(data["dias_json"].length == 0){
      alert("Favor de seleccionar al menos un dia.");
      error["dias_json"] = this.errorService.required;

    }
    return error;
  }




}


