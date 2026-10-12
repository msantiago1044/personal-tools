export type AnswerKey = 'A' | 'B' | 'C';

export interface CheckpointQuestion {
  id: string;
  question: string;
  options: { key: AnswerKey; text: string }[];
  correctKey: AnswerKey;
  justification: {
    correct: string;
    incorrect: string;
  };
}

export interface PgnClass {
  id: number; // 1 - 40
  title: string;
  week: number; // 1 - 10
  moduleId: number; // 1 - 5
  moduleTitle: string;
  objective: string;
  legalBasis: string;
  conceptCapsule: string;
  barandaCase: {
    title: string;
    situation: string;
    resolution: string;
  };
  examTrap: {
    title: string;
    trap: string;
    rule: string;
  };
  checkpoint: CheckpointQuestion;
}

export interface PgnExamQuestion {
  id: number;
  question: string;
  options: { key: AnswerKey; text: string }[];
  correctKey: AnswerKey;
  explanation: string;
  category: 'conocimientos' | 'comportamentales';
}

export interface PgnExam {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  timeLimitMinutes: number;
  cutoffPercentage: number;
  questions: PgnExamQuestion[];
}

export interface PgnModuleMeta {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  weeks: string;
  classRange: [number, number];
  color: string;
  accentBg: string;
}

export interface UserPgnProgress {
  completedClasses: number[]; // ids de clases
  checkpointAnswers: Record<number, AnswerKey>; // classId -> selectedKey
  examResults: Record<
    string,
    {
      score: number;
      total: number;
      percentage: number;
      passed: boolean;
      date: string;
    }
  >;
}
