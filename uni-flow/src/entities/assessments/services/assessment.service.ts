import type { Assessment } from "../entities/assessment.entity";
import type { CreateAssessmentDto, EnterScoreDto, UpdateAssessmentDto } from "../dto";

interface AssessmentModel extends Omit<Assessment, 'dueDate'> {
  dueDate: Date | string | null;
}

const API_BASE_URL = '/api/assessments';

// Helper: convert DB row → front-end Assessment entity
function toEntity(a: AssessmentModel): Assessment {
  return {
    id: a.id,
    subjectId: a.subjectId,
    title: a.title,
    type: a.type,
    description: a.description ?? undefined,
    weight: a.weight,
    maxScore: a.maxScore,
    score: a.score ?? null,
    dueDate: a.dueDate ? (typeof a.dueDate === 'string' ? a.dueDate : a.dueDate.toISOString()) : undefined,
  };
}

// GET: list all assessments for a subject
export async function listAssessments(params: { subjectId: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}?subjectId=${encodeURIComponent(params.subjectId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessments');
    }
    const data = await response.json();
    return data.map(toEntity);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }
}

// GET: get an assessment by ID
export async function getAssessment(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assessment');
    }
    const data = await response.json();
    return toEntity(data);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    throw error;
  }
}

// POST: create a new assessment
export async function createAssessment(params: { dto: CreateAssessmentDto }) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.dto),
    });

    if (!response.ok) {
      throw new Error('Failed to create assessment');
    }

    const data = await response.json();
    return toEntity(data);
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
}

// PATCH: enter/update score
export async function enterScore(params: { dto: EnterScoreDto }) {
  try {
    const { assessmentId, score } = params.dto;
    const response = await fetch(`${API_BASE_URL}/${assessmentId}/score`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score }),
    });

    if (!response.ok) {
      throw new Error('Failed to update score');
    }

    const data = await response.json();
    return toEntity(data);
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
}

// PATCH: Update assessment
export async function updateAssessment(params: { id: string; dto: UpdateAssessmentDto }) {
  try {
    const { id, dto } = params;
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error('Failed to update assessment');
    }

    const data = await response.json();
    return toEntity(data);
  } catch (error) {
    console.error('Error updating assessment:', error);
    throw error;
  }
}

// DELETE: Delete assessment
export async function deleteAssessment(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete assessment');
    }
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
}
