import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  httpResource
} from '@angular/common/http';

interface User {
  _id?: string;
  name: string;
  email: string;
  age: number;
  role: string;
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
export class UsersComponent {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/users';

  // -----------------------------
  // GET USERS - httpResource
  // -----------------------------

  usersResource = httpResource<User[]>(
    () => this.apiUrl
  );

  // -----------------------------
  // Form State
  // -----------------------------

  user = signal<User>({
    name: '',
    email: '',
    age: 0,
    role: 'user'
  });

  editingUserId = signal<string | null>(null);

  error = signal('');
  success = signal('');

  // -----------------------------
  // Computed
  // -----------------------------

  users = computed(
    () => this.usersResource.value() ?? []
  );

  loading = computed(
    () => this.usersResource.isLoading()
  );

  isEditing = computed(
    () => !!this.editingUserId()
  );

  // -----------------------------
  // CREATE USER
  // -----------------------------

  createUser(): void {

    const currentUser = this.user();

    if (
      !currentUser.name.trim() ||
      !currentUser.email.trim()
    ) {
      this.error.set('Name and email are required.');
      return;
    }

    this.error.set('');
    this.success.set('');

    this.http
      .post<User>(this.apiUrl, currentUser)
      .subscribe({

        next: () => {

          // Reload GET resource
          this.usersResource.reload();

          this.resetForm();

          this.success.set(
            'User created successfully.'
          );
        },

        error: (error) => {
          console.error(error);

          this.error.set(
            error.error?.message ||
            'Failed to create user.'
          );
        }

      });
  }

  // -----------------------------
  // EDIT USER
  // -----------------------------

  editUser(user: User): void {

    this.editingUserId.set(
      user._id ?? null
    );

    this.user.set({
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role
    });

    this.error.set('');
    this.success.set('');
  }

  // -----------------------------
  // UPDATE USER
  // -----------------------------

  updateUser(): void {

    const id = this.editingUserId();
    const currentUser = this.user();

    if (!id) {
      return;
    }

    if (
      !currentUser.name.trim() ||
      !currentUser.email.trim()
    ) {
      this.error.set(
        'Name and email are required.'
      );
      return;
    }

    this.error.set('');
    this.success.set('');

    this.http
      .put<User>(
        `${this.apiUrl}/${id}`,
        currentUser
      )
      .subscribe({

        next: () => {

          // Reload GET resource
          this.usersResource.reload();

          this.resetForm();

          this.success.set(
            'User updated successfully.'
          );
        },

        error: (error) => {
          console.error(error);

          this.error.set(
            error.error?.message ||
            'Failed to update user.'
          );
        }

      });
  }

  // -----------------------------
  // DELETE USER
  // -----------------------------

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

    this.error.set('');
    this.success.set('');

    this.http
      .delete(
        `${this.apiUrl}/${user._id}`
      )
      .subscribe({

        next: () => {

          // Reload GET resource
          this.usersResource.reload();

          this.success.set(
            'User deleted successfully.'
          );
        },

        error: (error) => {
          console.error(error);

          this.error.set(
            error.error?.message ||
            'Failed to delete user.'
          );
        }

      });
  }

  // -----------------------------
  // CANCEL EDIT
  // -----------------------------

  cancelEdit(): void {
    this.resetForm();
  }

  // -----------------------------
  // RESET FORM
  // -----------------------------

  resetForm(): void {

    this.user.set({
      name: '',
      email: '',
      age: 0,
      role: 'user'
    });

    this.editingUserId.set(null);
  }
}