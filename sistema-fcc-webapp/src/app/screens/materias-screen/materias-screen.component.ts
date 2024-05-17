import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MateriasService } from 'src/app/services/materias.service';
import { FacadeService } from 'src/app/services/facade.service';
import { EliminarMateriaModalComponent } from 'src/app/modals/eliminar-materia-modal/eliminar-materia-modal.component';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit{

  public name_user:string = "";
  public lista_materias:any[]= [];
  public rol:string = "";
  public token : string = "";


  //Para la tabla
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(
    public facadeService: FacadeService,
    private materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog
  ){
  }

  ngOnInit(): void {
    //aqui se obtiene el nombre del usuario y  el rol para el mensaje de bienvenido 
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate([""]);
    }
    //Obtener materia
    this.obtenerMateria();
    //Para paginador
    this.initPaginator();
     this.filtroColumnas();
  }

  public filtroColumnas(){
    if(this.rol == "administrador"){
      this.displayedColumns = ['nrc', 'nombre_materia', 'seccion', 'dias_json', 'hora_inicio', 'hora_fin', 'salon', 'programa_educativo', 'editar', 'eliminar'];
    }else if(this.rol == "maestro"){
      this.displayedColumns = ['nrc', 'nombre_materia', 'seccion', 'dias_json', 'hora_inicio', 'hora_fin', 'salon', 'programa_educativo'];
    }
  }

  //Para paginación
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
  }

  //Obtener tabla de materias
  public obtenerMateria(){
    this.materiasService.obtenerListaMaterias().subscribe(
      (response)=>{
        this.lista_materias = response;
        console.log("Lista materias: ", this.lista_materias);
        if(this.lista_materias.length > 0){
          console.log("Materias: ", this.lista_materias);
          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
        }
      }, (error)=>{
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  //Funcion para editar
  public goEditar(idMateria: number){
    this.router.navigate(["registro-materias/"+idMateria]);
  }

  //funcion para eliminar 

  public delete(idMateria: number){
    console.log("User:", idMateria);
    const dialogRef = this.dialog.open(EliminarMateriaModalComponent,{ //se llama al modal para confirmar eliminar
      data: {id: idMateria}, //Se pasan valores a través del componente
      height: '268px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Materia eliminado");
        alert("Materia Eliminada");
        //Recargar página
        window.location.reload();
      }else{
        alert("No se elimino materia ");
        console.log("No se eliminó la materia");
      }
    });
  }

}


export interface DatosMateria {
  id: number,
  nrc: number;
  nombre: string;
  seccion: string;
  hora_inicio: string;
  hora_fin: string,
  salon: number,
  programa_educativo: number,
  dias_json: string,
}