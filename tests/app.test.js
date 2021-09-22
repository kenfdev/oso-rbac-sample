import { Oso } from 'oso';
import { Organization } from '../models/organization';
import { Repository } from '../models/repository';
import { User } from '../models/user';

describe('Oso tests', () => {
  let oso = null;
  let org = null;
  let repo = null;
  let alice = null;
  let bob = null;
  let tom = null;
  let jane = null;
  beforeAll(async () => {
    oso = new Oso();
    oso.registerClass(Organization);
    oso.registerClass(Repository);
    oso.registerClass(User);

    await oso.loadFiles([`${__dirname}/../policies/main.polar`]);

    org = new Organization('ACME');
    repo = new Repository('ACME App', org);

    alice = new User('Alice');
    alice.assignRoleForResource('contributor', repo);

    bob = new User('Bob');
    bob.assignRoleForResource('maintainer', repo);

    tom = new User('Tom');
    tom.assignRoleForResource('owner', org);

    jane = new User('Jane');
    jane.assignRoleForResource('guest', repo);
  });

  describe('repository contributor', () => {
    it('should have `read` permissions if the user is a contributor', async () => {
      const result = await oso.isAllowed(alice, 'read', repo);
      expect(result).toBe(true);
    });

    it('should not have `push` permissions if the user is a contributor', async () => {
      const result = await oso.isAllowed(alice, 'push', repo);
      expect(result).toBe(false);
    });
  });

  describe('repository maintainer', () => {
    it('should have `read` permissions if the user is a maintainer', async () => {
      const result = await oso.isAllowed(bob, 'read', repo);
      expect(result).toBe(true);
    });

    it('should have `push` permissions if the user is a maintainer', async () => {
      const result = await oso.isAllowed(bob, 'push', repo);
      expect(result).toBe(true);
    });
  });

  describe('organization owner', () => {
    it('should have `read` permissions if the user is the owner of the organization', async () => {
      const result = await oso.isAllowed(tom, 'read', repo);
      expect(result).toBe(true);
    });

    it('should have `push` permissions if the user is the owner of the organization', async () => {
      const result = await oso.isAllowed(tom, 'push', repo);
      expect(result).toBe(true);
    });
  });

  describe('others', () => {
    it('should not have `read` permissions if they do not have a valid role', async () => {
      const result = await oso.isAllowed(jane, 'read', repo);
      expect(result).toBe(false);
    });

    it('should not have `read` permissions if they do not have a valid role', async () => {
      const result = await oso.isAllowed(jane, 'push', repo);
      expect(result).toBe(false);
    });
  });
});
