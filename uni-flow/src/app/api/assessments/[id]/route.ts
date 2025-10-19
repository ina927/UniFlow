import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { toDbAssessmentType } from '@/entities/assessments/services/assessment.service';

type RouteCtx = { params: Promise<{ id: string }> };


// GET: Get a single assessment by ID
export async function GET(
  request: Request,
  ctx: RouteCtx 
) {
  try {
    const { id } = await ctx.params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
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
  ctx: RouteCtx 
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const data = { ...body, type: toDbAssessmentType(body.type) };

    const updatedAssessment = await prisma.assessment.update({
      where: { id },
      data,
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
  ctx: RouteCtx
) {
  try {
    const { id } = await ctx.params;
    await prisma.assessment.delete({
      where: { id },
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
