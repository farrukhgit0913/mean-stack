import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  _id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})

export class UsersComponent implements OnInit {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/users';

  users: User[] = [];

  user: User = {
    name: '',
    email: '',
  };

  editingUserId: string | null = null;
  loading = false;
  error = '';
  success = '';

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.loading = true;
    this.error = '';

    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        console.log('this.users: ', this.users);
        console.log('this.loading: ', this.loading);
      },
      error: (error) => {
        console.error(error);
        this.error = 'Failed to load users.';
        this.loading = false;
      },
    });
  }

  createUser(): void {
    if (!this.user.name.trim() || !this.user.email.trim()) {
      this.error = 'Name and email are required.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post<User>(this.apiUrl, this.user).subscribe({
      next: (user) => {
        this.users.unshift(user);
        this.resetForm();

        this.success = 'User created successfully.';
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.error =
          error.error?.message || 'Failed to create user.';
        this.loading = false;
      },
    });
  }

  editUser(user: User): void {
    this.editingUserId = user._id || null;

    this.user = {
      name: user.name,
      email: user.email,
    };

    this.error = '';
    this.success = '';
  }

  updateUser(): void {
    if (!this.editingUserId) {
      return;
    }

    if (!this.user.name.trim() || !this.user.email.trim()) {
      this.error = 'Name and email are required.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http
      .put<User>(
        `${this.apiUrl}/${this.editingUserId}`,
        this.user
      )
      .subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(
            (user) => user._id === updatedUser._id
          );

          if (index !== -1) {
            this.users[index] = updatedUser;
          }

          this.resetForm();

          this.success = 'User updated successfully.';
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.error =
            error.error?.message || 'Failed to update user.';
          this.loading = false;
        },
      });
  }

  deleteUser(user: User): void {
    if (!user._id) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.http
      .delete(`${this.apiUrl}/${user._id}`)
      .subscribe({
        next: () => {
          this.users = this.users.filter(
            (item) => item._id !== user._id
          );

          this.success = 'User deleted successfully.';
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.error =
            error.error?.message || 'Failed to delete user.';
          this.loading = false;
        },
      });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.user = {
      name: '',
      email: '',
    };

    this.editingUserId = null;
  }
}
