import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MateriasService} from 'src/app/services/materias.service';



@Component({
  selector: 'app-editar-user',
  templateUrl: './editar-user.component.html',
  styleUrls: ['./editar-user.component.scss']
})
export class EditarUserComponent {
  public rol: string = "";

  constructor(
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private dialogRef: MatDialogRef<EditarUserComponent>,
    private router: Router,
    public materiasService: MateriasService,


    @Inject (MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    console.log("Id materia: ", this.data.id);

  }

  public cerrar_modal(){
    this.dialogRef.close({isDelete:false});
  }

  public editarUser() {
    this.dialogRef.close({isDelete:true});
  }
}
