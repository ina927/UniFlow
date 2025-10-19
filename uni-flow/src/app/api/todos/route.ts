import { NextRequest, NextResponse } from 'next/server';

import { ToDoStatus } from '@/entities/todos/enums';
import { prisma } from '@/shared/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { newToDo } = await request.json();

    console.log('newToDo', newToDo);

    // Validate required fields
    if (!newToDo.title || !newToDo.userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      );
    }

    const savedToDo = await prisma.toDo.create({
      data: {
        userId: newToDo.userId,
        title: newToDo.title,
        subjectId: newToDo.subjectId,
        assessmentId: newToDo.assessmentId || null,
        description: newToDo.description,
        startDate: newToDo.startDate,
        endDate: newToDo.endDate,
        status: ToDoStatus.PENDING,
      },
    });

    return NextResponse.json(savedToDo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const toDos = await prisma.toDo.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    }); //{where:{userId: {not: null}}}

    return NextResponse.json(toDos, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
