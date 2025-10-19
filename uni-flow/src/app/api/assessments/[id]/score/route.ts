import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

type Context = { params?: Record<string, string> };

export async function PATCH(req: Request, ctx: unknown) {
  const { params } = (ctx as Context) ?? {};
  const id = params?.id;

  try {
    const { score } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Missing assessment ID' },
        { status: 400 }
      );
    }

    const updatedAssessment = await prisma.assessment.update({
      where: { id },
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
