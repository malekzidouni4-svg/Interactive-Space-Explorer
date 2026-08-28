export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const spaceQuizQuestions: QuizQuestion[] = [
  {
    question: "ما هو أشد كواكب المجموعة الشمسية حرارة؟",
    options: ["عطارد", "الزهرة", "المريخ", "المشتري"],
    correctIndex: 1,
    explanation: "الزهرة هو الأشد حرارة بفضل غلافه الجوي الكثيف المحتبس للحرارة."
  },
  {
    question: "كم يستغرق ضوء الشمس للوصول إلى الأرض؟",
    options: ["8 دقائق و20 ثانية", "1 دقيقة", "1 ساعة", "فوراً بدون وقت"],
    correctIndex: 0,
    explanation: "يسافر الضوء بسرعة 300,000 كم/ثانية ويصل من الشمس للأرض في 8 دقائق و20 ثانية."
  },
  {
    question: "أيها يمتلك أكبر عدد من الأقمار المعروفة حتى الآن؟",
    options: ["الأرض", "زحل", "المريخ", "عطارد"],
    correctIndex: 1,
    explanation: "يمتلك زحل 146 قمراً معروفاً معطلاً جميع الكواكب."
  },
  {
    question: "ما اسم الكوكب المعروف بـ 'الكوكب الأحمر'؟",
    options: ["أورانوس", "المريخ", "نبتون", "الزهرة"],
    correctIndex: 1,
    explanation: "يُعرف المريخ بالكوكب الأحمر بسبب انتشارات أكسيد الحديد الصدِئ على سطحه."
  }
];

export class QuizSystem {
  private currentIndex = 0;
  private score = 0;

  get currentQuestion(): QuizQuestion {
    return spaceQuizQuestions[this.currentIndex];
  }

  get totalQuestions(): number {
    return spaceQuizQuestions.length;
  }

  get currentScore(): number {
    return this.score;
  }

  submitAnswer(index: number): boolean {
    const isCorrect = index === this.currentQuestion.correctIndex;
    if (isCorrect) {
      this.score += 10;
    }
    return isCorrect;
  }

  nextQuestion(): boolean {
    if (this.currentIndex < spaceQuizQuestions.length - 1) {
      this.currentIndex += 1;
      return true;
    }
    return false;
  }

  reset(): void {
    this.currentIndex = 0;
    this.score = 0;
  }
}
