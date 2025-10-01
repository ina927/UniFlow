import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { score } = await request.json();
    
    const updatedAssessment = await prisma.assessment.update({
      where: { id: params.id },
      data: { score },
    });

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}
