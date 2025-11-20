import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  rating: number;
  ratingCount: number;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Будущее веб-разработки в 2025',
    excerpt: 'Разбираем главные тренды и технологии, которые изменят индустрию',
    content: 'Веб-разработка переживает период стремительных изменений. Искусственный интеллект становится неотъемлемой частью процесса создания сайтов и приложений. Новые фреймворки и инструменты делают разработку быстрее и доступнее. В этой статье мы рассмотрим ключевые технологии, которые определят будущее веб-разработки: от серверных компонентов React до edge computing и WebAssembly. Каждая из этих технологий открывает новые возможности для создания быстрых, масштабируемых и удобных веб-приложений.',
    image: 'https://cdn.poehali.dev/projects/9b2f358b-88ff-43ae-b205-163c8156c591/files/b31280e1-1e46-474a-bf7c-ad9e3bb6cd68.jpg',
    author: 'Анна Смирнова',
    date: '15 ноября 2024',
    category: 'Технологии',
    rating: 4.5,
    ratingCount: 127
  },
  {
    id: 2,
    title: 'Искусство создания UX/UI дизайна',
    excerpt: 'Практические советы по созданию интуитивных интерфейсов',
    content: 'Хороший дизайн незаметен. Пользователь должен легко достигать своих целей, не задумываясь о том, как устроен интерфейс. В этой статье мы разберем основные принципы создания эффективного UX/UI дизайна: от исследования пользователей до прототипирования и тестирования. Узнаете, как правильно структурировать информацию, выбирать цветовую палитру и создавать визуальную иерархию. Рассмотрим реальные примеры удачных и неудачных решений в интерфейсах популярных сервисов.',
    image: 'https://cdn.poehali.dev/projects/9b2f358b-88ff-43ae-b205-163c8156c591/files/f327e7a3-64a7-4f14-88df-65ceff966c77.jpg',
    author: 'Дмитрий Волков',
    date: '12 ноября 2024',
    category: 'Дизайн',
    rating: 4.8,
    ratingCount: 203
  },
  {
    id: 3,
    title: 'TypeScript: Полное руководство',
    excerpt: 'Углубляемся в мир типизированного JavaScript',
    content: 'TypeScript стал стандартом де-факто для крупных JavaScript проектов. Он добавляет систему типов, которая помогает избежать ошибок на этапе разработки и делает код более понятным и поддерживаемым. В этом подробном руководстве вы узнаете всё о TypeScript: от базовых типов до продвинутых паттернов с дженериками и условными типами. Научитесь правильно типизировать React компоненты, работать с асинхронным кодом и настраивать конфигурацию компилятора для максимальной строгости проверок.',
    image: 'https://cdn.poehali.dev/projects/9b2f358b-88ff-43ae-b205-163c8156c591/files/1e3fde4c-e31d-4ab0-b9bf-79085ccf66ae.jpg',
    author: 'Елена Петрова',
    date: '10 ноября 2024',
    category: 'Разработка',
    rating: 4.6,
    ratingCount: 156
  }
];

const Index = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [hoveredRating, setHoveredRating] = useState<Record<number, number>>({});

  const handleRating = async (articleId: number, rating: number) => {
    setUserRatings(prev => ({ ...prev, [articleId]: rating }));
    
    try {
      const response = await fetch('https://functions.poehali.dev/ffba078a-3171-48bb-9da9-93136f62c0b8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: articleId, rating })
      });
      
      if (!response.ok) {
        console.error('Failed to save rating');
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };

  const StarRating = ({ article }: { article: Article }) => {
    const userRating = userRatings[article.id] || 0;
    const displayRating = hoveredRating[article.id] || userRating;

    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={(e) => {
                e.stopPropagation();
                handleRating(article.id, star);
              }}
              onMouseEnter={() => setHoveredRating(prev => ({ ...prev, [article.id]: star }))}
              onMouseLeave={() => setHoveredRating(prev => ({ ...prev, [article.id]: 0 }))}
              className="transition-transform hover:scale-125"
            >
              <Icon
                name="Star"
                size={20}
                className={star <= displayRating ? "fill-accent text-accent" : "text-muted-foreground"}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {article.rating} ({article.ratingCount})
        </span>
      </div>
    );
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="BookOpen" size={28} className="text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TechBlog
              </h1>
            </div>
            <Button onClick={() => setSelectedArticle(null)} variant="ghost">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
          </div>
        </nav>

        <article className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
          <Badge className="mb-4">{selectedArticle.category}</Badge>
          <h1 className="text-5xl font-bold mb-6 leading-tight">{selectedArticle.title}</h1>
          
          <div className="flex items-center gap-6 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="User" size={18} />
              <span>{selectedArticle.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              <span>{selectedArticle.date}</span>
            </div>
          </div>

          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="w-full h-96 object-cover rounded-2xl mb-8 shadow-2xl"
          />

          <div className="prose prose-lg prose-invert max-w-none mb-12">
            <p className="text-xl text-muted-foreground leading-relaxed">
              {selectedArticle.content}
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Оцените статью</h3>
              <StarRating article={selectedArticle} />
              {userRatings[selectedArticle.id] && (
                <p className="text-sm text-muted-foreground mt-4">
                  Спасибо за вашу оценку! ⭐
                </p>
              )}
            </CardContent>
          </Card>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="BookOpen" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TechBlog
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost">Главная</Button>
            <Button variant="ghost">Статьи</Button>
            <Button variant="default">
              <Icon name="PenSquare" size={18} className="mr-2" />
              Написать
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 opacity-50"></div>
        <div className="container mx-auto text-center relative z-10 animate-fade-in">
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            Исследуйте мир
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              технологий
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Статьи о разработке, дизайне и современных технологиях от ведущих экспертов
          </p>
          <Button size="lg" className="text-lg px-8">
            Начать читать
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-bold">Популярные статьи</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Icon name="TrendingUp" size={16} className="mr-2" />
              Популярное
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Clock" size={16} className="mr-2" />
              Новое
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card
              key={article.id}
              className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer animate-scale-in border-2 hover:border-primary/50"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedArticle(article)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 left-4">{article.category}</Badge>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
                <StarRating article={article} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 TechBlog. Создано с ❤️ для сообщества разработчиков</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;