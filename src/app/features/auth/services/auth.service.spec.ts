import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/users`;

  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findByEmail', () => {
    it('should call GET /users/:email', () => {
      service.findByEmail('test@example.com').subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${baseUrl}/test%40example.com`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('createUser', () => {
    it('should call POST /users with email payload', () => {
      service.createUser({ email: 'new@example.com' }).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'new@example.com' });
      req.flush(mockUser);
    });
  });
});
