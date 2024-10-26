import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  public currentUser: Observable<Usuario | null> = this.currentUserSubject.asObservable();

  constructor(private angularFireAuth: AngularFireAuth, private firestore: AngularFirestore) { 
    this.setPersistence();
    this.angularFireAuth.authState.subscribe(async (user) => {
      if (user) {
        const userDoc = await this.firestore.collection('usuarios').doc(user.uid).get().toPromise();
        const userData = userDoc?.data() as Usuario;
        this.currentUserSubject.next(userData); 
      } else {
        this.currentUserSubject.next(null); 
      }
    });
  }

  private async setPersistence() {
    await this.angularFireAuth.setPersistence('local'); 
  }

  async login(email: string, pass: string) {
    try {
      const userCredential = await this.angularFireAuth.signInWithEmailAndPassword(email, pass);
      const userDoc = await this.firestore.collection('usuarios').doc(userCredential.user?.uid).get().toPromise();
      const userData = userDoc?.data() as Usuario;

      if (userData && userData.enabled) {
        this.currentUserSubject.next(userData);
        return userCredential;
      } else {
        throw new Error('auth/user-disabled');
      }
    } catch (error) {
      throw error;
    }
  }

  isLogged(): Observable<any> {
    return this.angularFireAuth.authState;
  }

  register(email: string, pass: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, pass);
  }

  async logout() {
    await this.angularFireAuth.signOut();
    this.currentUserSubject.next(null); 
  }

  getCurrentUser() {
    return this.angularFireAuth.currentUser;
  }

  async ExisteUser(email: string) {
    return this.angularFireAuth.fetchSignInMethodsForEmail(email);
  }

  recoveryPassword(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('Correo enviado!');
      })
      .catch((error) => {
        console.log('Error al enviar el correo!');
        throw error;
      });
  }
}
