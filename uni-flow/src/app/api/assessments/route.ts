import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { AssessmentType } from '@/entities/assessments';

// GET: List all assessments for a subject
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get('subjectId');
  
  if (!subjectId) {
    return NextResponse.json(
      { error: 'subjectId is required' },
      { status: 400 }
    );
  }

  try {
    const assessments = await prisma.assessment.findMany({
      where: { subjectId },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(assessments.map(a => ({
      ...a,
      type: a.type as AssessmentType,
    })));
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

// POST: Create a new assessment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const assessment = await prisma.assessment.create({
      data: body,
    });
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}
