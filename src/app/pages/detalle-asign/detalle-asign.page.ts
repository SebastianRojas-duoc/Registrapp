import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-detalle-asign',
  templateUrl: './detalle-asign.page.html',
  styleUrls: ['./detalle-asign.page.scss'],
})
export class DetalleAsignPage implements OnInit {
  asignatura: any = {}; // Datos de la asignatura
  nombreCarrera: string = ''; // Nombre de la carrera

  constructor(
    private route: ActivatedRoute,
    private firestoreService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Obtenemos la asignatura y verificamos en la consola
      this.firestoreService.getAsignaturaById(id).subscribe((data) => {
        if (data) {
          console.log("Asignatura obtenida:", data);
          this.asignatura = data;

          // Obtenemos la carrera si existe idCarrera
          if (this.asignatura.idCarrera) {
            this.firestoreService.getCarreraById(this.asignatura.idCarrera).subscribe((carreraData) => {
              if (carreraData) {
                console.log("Carrera obtenida:", carreraData);
                this.nombreCarrera = carreraData.nombre; // Supongamos que el campo es "nombre"
              } else {
                console.error("No se encontró la carrera con ID:", this.asignatura.idCarrera);
              }
            });
          } else {
            console.warn("El campo idCarrera está vacío en la asignatura.");
          }
        } else {
          console.error("No se encontró la asignatura con ID:", id);
        }
      });
    } else {
      console.error("No se recibió un ID de asignatura en la ruta.");
    }
  }
}
