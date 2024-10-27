import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Carrera } from 'src/app/interfaces/carrera';

@Component({
  selector: 'app-detalle-asign',
  templateUrl: './detalle-asign.page.html',
  styleUrls: ['./detalle-asign.page.scss'],
})
export class DetalleAsignPage implements OnInit {
  asignaturaId?: string;
  asignatura: Asignatura | undefined;
  carrera: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.asignaturaId = params.get('id')!;
      this.obtenerDetallesAsignatura(this.asignaturaId);
    });
  }

  obtenerDetallesAsignatura(id: string) {
    this.firestore.collection('asignaturas').doc(id).valueChanges().subscribe((asignaturaData) => {
      const asignatura = asignaturaData as Asignatura | undefined;
      if (asignatura) {
        this.asignatura = asignatura;

        const carreraId = this.asignatura.carrera;

        this.firestore.collection('carreras').doc(carreraId).valueChanges().subscribe((carreraData) => {
          const carrera = carreraData as Carrera | undefined; 
          if (carrera) {
            this.carrera = carrera.nombre;
          } else {
            console.error(`No se encontró la carrera con ID: ${carreraId}`);
          }
        });
      } else {
        console.error(`No se encontró la asignatura con ID: ${id}`);
      }
    });
  }
}
