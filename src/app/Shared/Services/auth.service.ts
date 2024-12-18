import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedUser: boolean = false;
  constructor() { }
  isLoggedIn(): boolean {
    // Check if the user is authenticated (for example, by checking a token in localStorage)
    return this.isAuthenticatedUser;
  }
  Login() {
    this.isAuthenticatedUser = true;  // Simulate a successful login
  }

  Logout() {
    this.isAuthenticatedUser = false;  // Simulate a logout
  }
}
