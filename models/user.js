import { Role } from './role';

export class User {
  constructor(name) {
    this.name = name;
    this.roles = new Set();
  }

  assignRoleForResource(name, resource) {
    this.roles.add(new Role(name, resource));
  }
}
