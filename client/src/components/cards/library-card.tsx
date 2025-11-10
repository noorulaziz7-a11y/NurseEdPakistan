import { Button } from "@/components/ui/button";
import { FileText, Book, Play, Download, Eye, Bookmark, Star } from "lucide-react";
import type { StudyLibrary } from "@shared/schema";

interface LibraryCardProps {
  library: StudyLibrary;
}

export default function LibraryCard({ library }: LibraryCardProps) {
  const getIcon = () => {
    switch (library.type) {
      case "PDF":
        return FileText;
      case "EPUB":
        return Book;
      case "Video":
        return Play;
      default:
        return FileText;
    }
  };

  const getIconColor = () => {
    switch (library.type) {
      case "PDF":
        return "text-primary";
      case "EPUB": 
        return "text-secondary";
      case "Video":
        return "text-accent";
      default:
        return "text-primary";
    }
  };

  const getLevelColor = () => {
    switch (library.level) {
      case "beginner":
        return "bg-primary/10 text-primary";
      case "intermediate":
        return "bg-accent/10 text-accent";
      case "advanced":
        return "bg-secondary/10 text-secondary";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const Icon = getIcon();

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow" data-testid={`card-library-${library.id}`}>
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-12 h-12 bg-${getIconColor().split('-')[1]}/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`${getIconColor()} text-xl`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-2" data-testid={`text-library-title-${library.id}`}>
            {library.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span data-testid={`text-library-type-${library.id}`}>
              {library.type} {library.pageCount && `• ${library.pageCount} pages`} {library.duration && `• ${library.duration}`}
            </span>
            <span data-testid={`text-library-updated-${library.id}`}>
              Updated: {new Date(library.updatedAt!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4" data-testid={`text-library-description-${library.id}`}>
        {library.description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`${getLevelColor()} text-xs px-2 py-1 rounded`} data-testid={`badge-library-level-${library.id}`}>
            {library.level.charAt(0).toUpperCase() + library.level.slice(1)}
          </span>
          <span className={`${library.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-accent/10 text-accent'} text-xs px-2 py-1 rounded`} data-testid={`badge-library-price-${library.id}`}>
            {library.isPremium ? 'Premium' : 'Free'}
          </span>
        </div>
        {library.rating && (
          <div className="flex items-center text-yellow-500 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1" data-testid={`text-library-rating-${library.id}`}>{library.rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button 
          className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${
            library.isPremium 
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          data-testid={`button-library-action-${library.id}`}
        >
          {library.isPremium ? (
            <>
              <Download className="mr-2 w-4 h-4" />
              Upgrade to Access
            </>
          ) : library.type === "Video" ? (
            <>
              <Play className="mr-2 w-4 h-4" />
              Watch Now
            </>
          ) : (
            <>
              <Download className="mr-2 w-4 h-4" />
              Download
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
          data-testid={`button-library-preview-${library.id}`}
        >
          {library.type === "Video" ? <Bookmark className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}