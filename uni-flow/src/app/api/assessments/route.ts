import { NextResponse } from 'next/server';
import { listAssessments, createAssessment, toAssessmentType } from '@/entities/assessments/services';
import { Assessment } from '@/entities/assessments/entities';

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
    const assessments: Assessment[] = await listAssessments({ subjectId });

    return NextResponse.json(assessments);
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

    body.type = toAssessmentType(body.type);
    body.dueDate = body.dueDate ? new Date(body.dueDate) : new Date();
    body.description = body.description ?? undefined;

    const assessment = await createAssessment({ dto: body });
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    );
  }
}
