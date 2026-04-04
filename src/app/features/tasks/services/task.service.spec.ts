import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { TaskService } from './task.service';
import { StorageService } from '../../../core/services/storage.service';
import { Task } from '../../../core/models/task.model';
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
    it('should GET tasks and update tasks$ observable', () => {
      service.loadTasks().subscribe();

      const req = httpMock.expectOne(`${baseUrl}?userId=user-1`);
      expect(req.request.method).toBe('GET');
      req.flush([mockTask]);

      service.tasks$.subscribe((tasks) => {
        expect(tasks).toEqual([mockTask]);
      });
    });
  });

  describe('createTask', () => {
    it('should POST task and prepend it to tasks$', () => {
      service.createTask({ userId: 'user-1', title: 'New', description: '' }).subscribe();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockTask);

      service.tasks$.subscribe((tasks) => {
        expect(tasks[0]).toEqual(mockTask);
      });
    });
  });

  describe('updateTask', () => {
    it('should PUT task and update the task in tasks$', () => {
      // Pre-populate the internal state
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
    it('should DELETE task and remove it from tasks$', () => {
      (service as unknown as { _tasks: BehaviorSubject<Task[]> })._tasks.next([mockTask]);

      service.deleteTask('task-1').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/task-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      service.tasks$.subscribe((tasks) => {
        expect(tasks).toEqual([]);
      });
    });
  });
});
