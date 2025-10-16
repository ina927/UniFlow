import { DELETE, PUT } from '@/app/api/todos/[id]/route';
import { GET, POST } from '@/app/api/todos/route';
import { ToDoStatus } from '@/entities/todos/enums/ToDoStatus';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the database operations
const mockDb = {
  todos: new Map<string, any>(),
  create: function (data: any) {
    const id = `id-${Date.now()}`;
    const now = new Date();
    const todo = {
      id,
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    this.todos.set(id, todo);
    return Promise.resolve(todo);
  },
  findMany: function (params?: any) {
    const todos = Array.from(this.todos.values());
    // Handle filtering if params are provided
    if (params?.where?.userId) {
      return Promise.resolve(
        todos.filter((todo: any) => todo.userId === params.where.userId)
      );
    }
    return Promise.resolve(todos);
  },
  update: function (params: { where: { id: string }; data: any }) {
    const todo = this.todos.get(params.where.id);
    if (!todo) return Promise.resolve(null);
    const updated = {
      ...todo,
      ...params.data,
      updatedAt: new Date(),
    };
    this.todos.set(params.where.id, updated);
    return Promise.resolve(updated);
  },
  delete: function (params: { where: { id: string } }) {
    const exists = this.todos.has(params.where.id);
    if (exists) {
      this.todos.delete(params.where.id);
      return Promise.resolve({ count: 1 });
    }
    return Promise.resolve({ count: 0 });
  },
  deleteMany: function (params: { where: { id: string } }) {
    const exists = this.todos.has(params.where.id);
    if (exists) {
      this.todos.delete(params.where.id);
      return Promise.resolve({ count: 1 });
    }
    return Promise.resolve({ count: 0 });
  },
};

// Mock Prisma client
vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    toDo: mockDb,
  },
}));

describe('CRUD Operations - Todos API', () => {
  beforeEach(() => {
    // Clear all mocks and reset the mock database
    vi.clearAllMocks();
    mockDb.todos.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const newTodo = {
        userId: 'user-123',
        title: 'Test Todo',
        description: 'Test Description',
        status: ToDoStatus.PENDING,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-02'),
      };

      const request = new Request('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newToDo: newTodo }),
      });

      const response = await POST(request as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        title: 'Test Todo',
        description: 'Test Description',
        status: ToDoStatus.PENDING,
      });
      expect(data.id).toBeDefined();
    });
  });

  describe('GET /api/todos', () => {
    it('should retrieve all todos', async () => {
      // Add test data
      await mockDb.create({
        userId: 'user-123',
        title: 'Test Todo 1',
        description: 'Test 1',
        status: ToDoStatus.PENDING,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-02'),
      });

      const request = new Request('http://localhost:3000/api/todos', {
        headers: { 'user-id': 'user-123' },
      });

      const response = await GET(request as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0]).toMatchObject({
        title: 'Test Todo 1',
        description: 'Test 1',
      });
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      // First create a todo
      const todo = await mockDb.create({
        userId: 'user-123',
        title: 'Original Title',
        description: 'Original Description',
        status: ToDoStatus.PENDING,
      });

      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: ToDoStatus.IN_PROGRESS,
      };

      const request = new Request(
        `http://localhost:3000/api/todos/${todo.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );

      const response = await PUT(request, { params: { id: todo.id } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject(updates);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      // First create a todo
      const todo = await mockDb.create({
        userId: 'user-123',
        title: 'To be deleted',
        description: 'Will be deleted',
        status: ToDoStatus.PENDING,
      });

      const request = new Request(
        `http://localhost:3000/api/todos/${todo.id}`,
        {
          method: 'DELETE',
        }
      );

      const response = await DELETE(request, { params: { id: todo.id } });
      const data = await response?.json();

      expect(response?.status).toBe(200);
      expect(data).toEqual({ count: 1 });
    });
  });
});
