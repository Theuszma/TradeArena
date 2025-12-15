import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, CheckCircle, Lock, Clock, Trophy } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'article';
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  badge: string;
}

const learningModules: Module[] = [
  {
    id: 'basics',
    title: 'Stock Market Basics',
    description: 'Learn the fundamentals of how the stock market works',
    badge: 'Beginner',
    lessons: [
      {
        id: '1',
        title: 'What is the Stock Market?',
        description: 'An introduction to stock markets and how they function',
        duration: '8 min',
        type: 'video',
        completed: true,
        locked: false,
        videoUrl: 'https://www.youtube.com/embed/p7HKvqRI_Bo',
      },
      {
        id: '2',
        title: 'Understanding Stocks and Shares',
        description: 'Learn what stocks represent and how ownership works',
        duration: '12 min',
        type: 'article',
        completed: true,
        locked: false,
      },
      {
        id: '3',
        title: 'How Stock Prices Move',
        description: 'Supply, demand, and the factors that influence prices',
        duration: '10 min',
        type: 'video',
        completed: false,
        locked: false,
        videoUrl: 'https://www.youtube.com/embed/ZCFkWDdmXG8',
      },
      {
        id: '4',
        title: 'Bull vs Bear Markets',
        description: 'Understanding market cycles and trends',
        duration: '6 min',
        type: 'article',
        completed: false,
        locked: false,
      },
    ],
  },
  {
    id: 'analysis',
    title: 'Fundamental Analysis',
    description: 'Learn to evaluate companies based on their financials',
    badge: 'Intermediate',
    lessons: [
      {
        id: '5',
        title: 'Reading Financial Statements',
        description: 'Income statements, balance sheets, and cash flows',
        duration: '15 min',
        type: 'video',
        completed: false,
        locked: true,
        videoUrl: 'https://www.youtube.com/embed/WEDIj9JBTC8',
      },
      {
        id: '6',
        title: 'Key Financial Ratios',
        description: 'P/E ratio, EPS, and other important metrics',
        duration: '12 min',
        type: 'article',
        completed: false,
        locked: true,
      },
      {
        id: '7',
        title: 'Evaluating Company Health',
        description: 'Identifying strong companies vs weak ones',
        duration: '18 min',
        type: 'video',
        completed: false,
        locked: true,
        videoUrl: 'https://www.youtube.com/embed/xwKmAH_RtxE',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Analysis',
    description: 'Learn to read charts and identify patterns',
    badge: 'Advanced',
    lessons: [
      {
        id: '8',
        title: 'Introduction to Chart Reading',
        description: 'Candlesticks, trends, and basic patterns',
        duration: '14 min',
        type: 'video',
        completed: false,
        locked: true,
        videoUrl: 'https://www.youtube.com/embed/eynxyoKgpng',
      },
      {
        id: '9',
        title: 'Support and Resistance',
        description: 'Key price levels every trader should know',
        duration: '10 min',
        type: 'article',
        completed: false,
        locked: true,
      },
      {
        id: '10',
        title: 'Popular Technical Indicators',
        description: 'Moving averages, RSI, MACD and more',
        duration: '20 min',
        type: 'video',
        completed: false,
        locked: true,
        videoUrl: 'https://www.youtube.com/embed/kAe6oBVR2O0',
      },
    ],
  },
];

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModule, setExpandedModule] = useState<string>('basics');

  const totalLessons = learningModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = learningModules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.locked) {
      setSelectedLesson(lesson);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Center</h1>
        <p className="text-muted-foreground">
          Master the stock market with our structured learning path
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="glassmorphism">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Modules List */}
        <div className="lg:col-span-1 space-y-4">
          {learningModules.map((module) => {
            const moduleProgress = Math.round(
              (module.lessons.filter((l) => l.completed).length / module.lessons.length) * 100
            );
            return (
              <Card
                key={module.id}
                className={`glassmorphism cursor-pointer transition-all hover:border-primary/50 ${
                  expandedModule === module.id ? 'border-primary' : ''
                }`}
                onClick={() => setExpandedModule(module.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant={module.badge === 'Beginner' ? 'default' : 'secondary'}>
                      {module.badge}
                    </Badge>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {module.lessons.length} lessons
                    </span>
                    <span className="text-primary font-medium">{moduleProgress}%</span>
                  </div>
                  <Progress value={moduleProgress} className="h-2 mt-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Lessons and Content */}
        <div className="lg:col-span-2 space-y-4">
          {selectedLesson ? (
            <Card className="glassmorphism">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedLesson.title}</CardTitle>
                    <CardDescription>{selectedLesson.description}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedLesson(null)}>
                    ← Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedLesson.type === 'video' && selectedLesson.videoUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={selectedLesson.videoUrl}
                      title={selectedLesson.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      This is a text-based lesson about <strong>{selectedLesson.title}</strong>.
                      The content would include detailed explanations, examples, and key takeaways
                      about the topic.
                    </p>
                    <h3 className="text-foreground mt-6">Key Points</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>Understanding the core concepts</li>
                      <li>Real-world applications and examples</li>
                      <li>Common mistakes to avoid</li>
                      <li>Practice exercises and quizzes</li>
                    </ul>
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <Button>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>
                  {learningModules.find((m) => m.id === expandedModule)?.title}
                </CardTitle>
                <CardDescription>
                  {learningModules.find((m) => m.id === expandedModule)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {learningModules
                  .find((m) => m.id === expandedModule)
                  ?.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                        lesson.locked
                          ? 'opacity-50 cursor-not-allowed bg-muted/30'
                          : 'cursor-pointer hover:border-primary/50 hover:bg-primary/5'
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold">
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : lesson.locked ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {lesson.duration}
                        </span>
                        {lesson.type === 'video' ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <BookOpen className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
