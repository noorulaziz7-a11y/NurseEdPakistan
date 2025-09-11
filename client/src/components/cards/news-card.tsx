import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import type { NewsArticle } from "@shared/schema";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const getCategoryColor = () => {
    switch (article.category) {
      case "Healthcare Policy":
        return "bg-primary/10 text-primary";
      case "Exam Updates":
        return "bg-secondary/10 text-secondary";
      case "Career Opportunities":
        return "bg-accent/10 text-accent";
      case "Technology":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (featured) {
    return (
      <article className="bg-card rounded-xl shadow-sm border border-border overflow-hidden" data-testid={`card-news-featured-${article.id}`}>
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-64 object-cover"
            data-testid={`img-news-${article.id}`}
          />
        )}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className={`${getCategoryColor()} text-sm px-3 py-1 rounded-full`} data-testid={`badge-news-category-${article.id}`}>
              {article.category}
            </span>
            <span className="text-muted-foreground text-sm" data-testid={`text-news-date-${article.id}`}>
              {new Date(article.publishedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-card-foreground mb-4" data-testid={`text-news-title-${article.id}`}>
            {article.title}
          </h3>
          <p className="text-muted-foreground mb-4" data-testid={`text-news-excerpt-${article.id}`}>
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="text-primary text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground" data-testid={`text-news-author-${article.id}`}>{article.author}</p>
                <p className="text-xs text-muted-foreground" data-testid={`text-news-author-title-${article.id}`}>{article.authorTitle}</p>
              </div>
            </div>
            <Button variant="ghost" className="text-primary hover:underline font-medium p-0" data-testid={`button-read-more-${article.id}`}>
              Read More
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-card rounded-xl p-6 shadow-sm border border-border" data-testid={`card-news-${article.id}`}>
      <div className="flex items-center space-x-2 mb-3">
        <span className={`${getCategoryColor()} text-xs px-2 py-1 rounded-full`} data-testid={`badge-news-category-${article.id}`}>
          {article.category}
        </span>
        <span className="text-muted-foreground text-xs" data-testid={`text-news-date-${article.id}`}>
          {new Date(article.publishedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-card-foreground mb-3" data-testid={`text-news-title-${article.id}`}>
        {article.title}
      </h4>
      <p className="text-muted-foreground text-sm mb-3" data-testid={`text-news-excerpt-${article.id}`}>
        {article.excerpt}
      </p>
      <Button variant="ghost" className="text-primary hover:underline text-sm font-medium p-0" data-testid={`button-read-more-${article.id}`}>
        Read More
      </Button>
    </article>
  );
}
