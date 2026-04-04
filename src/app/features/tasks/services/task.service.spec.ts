import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { TaskService } from './task.service';
import { StorageService } from '../../../core/services/storage.service';
import { Task, PaginatedResponse } from '../../../core/models/task.model';
import { environment } from '../../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageService>;

  const baseUrl = `${environment.apiUrl}/tasks`;

  const mockTask: Task = {
    id: 'task-1',
    userId: 'user-1',
    title: 'Test task',
    description: 'A description',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockPaginatedResponse: PaginatedResponse<Task> = {
    metadata: { page: 1, numberOfPages: 1, limit: 5, offset: 0, total: 1 },
    data: [mockTask],
  };

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getUserId']);
    storageSpy.getUserId.and.returnValue('user-1');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: StorageService, useValue: storageSpy }],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadTasks', () => {
    it('should GET tasks with pagination params and update tasks$', () => {
      service.loadTasks(1, 5).subscribe((res) => {
        expect(res.metadata.total).toBe(1);
        expect(res.data).toEqual([mockTask]);
      });

      const req = httpMock.expectOne(`${baseUrl}?userId=user-1&limit=5&offset=0`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);

      service.tasks$.subscribe((tasks) => {
        expect(tasks).toEqual([mockTask]);
      });
    });

    it('should calculate offset from page number', () => {
      service.loadTasks(3, 5).subscribe();

      const req = httpMock.expectOne(`${baseUrl}?userId=user-1&limit=5&offset=10`);
      expect(req.request.method).toBe('GET');
      req.flush({
        ...mockPaginatedResponse,
        metadata: { ...mockPaginatedResponse.metadata, page: 3, offset: 10 },
      });
    });
  });

  describe('createTask', () => {
    it('should POST task and return it', () => {
      service.createTask({ userId: 'user-1', title: 'New', description: '' }).subscribe((task) => {
        expect(task).toEqual(mockTask);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: 'user-1', title: 'New', description: '' });
      req.flush(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should PUT task and update the task in tasks$', () => {
      (service as unknown as { _tasks: BehaviorSubject<Task[]> })._tasks.next([mockTask]);

      const updated = { ...mockTask, title: 'Updated' };
      service.updateTask('task-1', { title: 'Updated' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/task-1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updated);

      service.tasks$.subscribe((tasks) => {
        expect(tasks[0].title).toBe('Updated');
      });
    });
  });

  describe('deleteTask', () => {
    it('should DELETE task and return void', () => {
      service.deleteTask('task-1').subscribe((result) => {
        expect(result).toBeNull();
      });

      const req = httpMock.expectOne(`${baseUrl}/task-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
