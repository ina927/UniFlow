import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET: Get a single assessment by ID
export async function GET(
  request: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  }
}

// PATCH: Update an assessment
export async function PATCH(
  request: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    const body = await request.json();
    const updatedAssessment = await prisma.assessment.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an assessment
export async function DELETE(
  request: Request,
  { params }: { params: Record<string, string> }
) {
  try {
    await prisma.assessment.delete({
      where: { id: params.id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    );
  }
}
