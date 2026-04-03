import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('userId', () => {
    it('should return null when no userId stored', () => {
      expect(service.getUserId()).toBeNull();
    });

    it('should store and retrieve userId', () => {
      service.setUserId('user-123');
      expect(service.getUserId()).toBe('user-123');
    });
  });

  describe('userEmail', () => {
    it('should return null when no email stored', () => {
      expect(service.getUserEmail()).toBeNull();
    });

    it('should store and retrieve user email', () => {
      service.setUserEmail('test@example.com');
      expect(service.getUserEmail()).toBe('test@example.com');
    });
  });

  describe('clear', () => {
    it('should remove userId and email from storage', () => {
      service.setUserId('user-123');
      service.setUserEmail('test@example.com');

      service.clear();

      expect(service.getUserId()).toBeNull();
      expect(service.getUserEmail()).toBeNull();
    });
  });
});
