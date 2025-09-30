import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '@/app/api/todos/route';
import { PUT, DELETE } from '@/app/api/todos/[id]/route';
import { prisma } from '@/shared/lib';
import { ToDoStatus } from '@/entities/enums/ToDoStatus';

// Mock Prisma
vi.mock('@/shared/lib', () => ({
  prisma: {
    toDo: {
      create: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn()
    }
  }
}));

describe('CRUD Operations - Todos API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // C.R.U.D -> Create (C)
  describe('CREATE or POST /api/todos', () => {
    it('should create a new todo with all fields', async () => {
      const mockToDo = {
        id: '123',
        userId: 'user-456',
        subjectId: 'subject-789',
        assessmentId: null,
        title: 'Testing trial 1',
        description: 'Vi test API-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-15'),
        status: ToDoStatus.PENDING
      };

      const requestBody = {
        newToDo: {
          userId: 'user-456',
          subjectId: 'subject-789',
          assessmentId: null,
          title: 'Testing trial 1',
          content: 'Vi test API-1',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-15'),
          taskStatus: ToDoStatus.PENDING
        }
      };

      (prisma.toDo.create as any).mockResolvedValue(mockToDo);

      const mockRequest = { json: async () => requestBody };
      const response = await POST(mockRequest as any);
      const data = await response.json();

      // test outcome must fulfill this one here (I think)
      expect(response.status).toBe(201);
      expect(data).toEqual({
            ...mockToDo,
            startDate: mockToDo.startDate.toISOString(),
            endDate: mockToDo.endDate.toISOString(),
      });
      expect(prisma.toDo.create).toHaveBeenCalledWith({
        data: {
            userId: 'user-456',
            subjectId: 'subject-789',
            assessmentId: null,
            title: 'Testing trial 1',
            content: 'Vi test API-1',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-15'),
            taskStatus: ToDoStatus.PENDING
          }
      });
    });

    // this one is for any assessmentId (currently not connected to the assessment features, so it is hard coded or sometimes left null)
    it('should create todo with optional assessmentId', async () => {
      const requestBody = {
        newToDo: {
          userId: 'user-456',
          subjectId: 'subject-789',
          assessmentId: 'assessment-999',
          title: 'Study for exam',
          content: '',
          startDate: new Date(),
          endDate: new Date(),
          taskStatus: ToDoStatus.PENDING
        }
      };

      (prisma.toDo.create as any).mockResolvedValue({ id: '1', ...requestBody.newToDo });

      const mockRequest = { json: async () => requestBody };
      const response = await POST(mockRequest as any);

      expect(response.status).toBe(201);
      expect(prisma.toDo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            assessmentId: 'assessment-999'
          })
        })
      );
    });
  });

  // C.R.U.D -> Read (R)
  describe('READ or GET /api/todos', () => {

    // if the todo exists
    it('should retrieve all todos', async () => {
      const mockToDos = [
        {
          id: '1',
          userId: 'Admin',
          title: 'Todo 1',
          description: 'Testing testing',
          status: ToDoStatus.PENDING,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-15')
        },
        {
          id: '2',
          userId: 'Admin',
          title: 'Todo 2',
          description: 'Testing testing 2',
          status: ToDoStatus.IN_PROGRESS,
          startDate: new Date('2024-01-05'),
          endDate: new Date('2024-01-20')
        }
      ];

      (prisma.toDo.findMany as any).mockResolvedValue(mockToDos);

      const mockRequest = {
        headers: { get: vi.fn().mockReturnValue('Admin') }
      };

      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        {
          ...mockToDos[0],
          startDate: mockToDos[0].startDate.toISOString(),
          endDate: mockToDos[0].endDate.toISOString(),
        },
        {
          ...mockToDos[1],
          startDate: mockToDos[1].startDate.toISOString(),
          endDate: mockToDos[1].endDate.toISOString(),
        },
      ]);
      expect(data).toHaveLength(2);
      expect(prisma.toDo.findMany).toHaveBeenCalled();
    });

    // in case of no data found
    it('should return empty array when no todos exist', async () => {
      (prisma.toDo.findMany as any).mockResolvedValue([]);

      const mockRequest = {
        headers: { get: vi.fn().mockReturnValue('Admin') }
      };

      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
      expect(Array.isArray(data)).toBe(true);
        });
    });

    // C.R.U.D -> Update (U) (specific id)
    describe('UPDATE or PUT  /api/todos/[id]', () => {
        it('should update multiple fields at once', async () => {
        const mockUpdatedToDo = { count: 1 };
        (prisma.toDo.updateMany as any).mockResolvedValue(mockUpdatedToDo);

        const mockRequest = {
            json: async () => ({
            title: 'Updated Title',
            description: 'Updated Description',
            endDate: new Date('2024-02-01'),
            status: ToDoStatus.IN_PROGRESS,
            subjectId: 'new-subject-id'
            })
        };
        const mockContext = {
            params: Promise.resolve({ id: 'todo-123' })
        };

        const response = await PUT(mockRequest as any, mockContext as any);

        expect(response.status).toBe(200);
        expect(prisma.toDo.updateMany).toHaveBeenCalledWith({
            where: { id: 'todo-123' },
            data: {
              title: 'Updated Title',
              description: 'Updated Description',
              endDate: new Date('2024-02-01'),
              status: ToDoStatus.DONE, // ← match the request body
              subjectId: 'new-subject-id',
            },
          });
        });
    })

    // C.R.U.D -> Delete (D) (specific id)
    describe('DELETE - DELETE /api/todos/[id]', () => {
        it('should delete todo by id', async () => {
        const mockDeletedToDo = { count: 1 };
        (prisma.toDo.deleteMany as any).mockResolvedValue(mockDeletedToDo);

        const mockRequest = {};
        const mockContext = {
            params: Promise.resolve({ id: '123' })
        };

        const response = await DELETE(mockRequest as any, mockContext as any);
        const data = await response?.json();

        expect(response?.status).toBe(200);
        expect(data).toEqual(mockDeletedToDo);
        expect(prisma.toDo.deleteMany).toHaveBeenCalledWith({
            where: { id: '123' }
        });
    });
  });
})