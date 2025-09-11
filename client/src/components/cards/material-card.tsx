import { Button } from "@/components/ui/button";
import { FileText, Book, Play, Download, Eye, Bookmark, Star } from "lucide-react";
import type { StudyMaterial } from "@shared/schema";

interface MaterialCardProps {
  material: StudyMaterial;
}

export default function MaterialCard({ material }: MaterialCardProps) {
  const getIcon = () => {
    switch (material.type) {
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
    switch (material.type) {
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
    switch (material.level) {
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
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow" data-testid={`card-material-${material.id}`}>
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-12 h-12 bg-${getIconColor().split('-')[1]}/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`${getIconColor()} text-xl`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-2" data-testid={`text-material-title-${material.id}`}>
            {material.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span data-testid={`text-material-type-${material.id}`}>
              {material.type} {material.pageCount && `• ${material.pageCount} pages`} {material.duration && `• ${material.duration}`}
            </span>
            <span data-testid={`text-material-updated-${material.id}`}>
              Updated: {new Date(material.updatedAt!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4" data-testid={`text-material-description-${material.id}`}>
        {material.description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`${getLevelColor()} text-xs px-2 py-1 rounded`} data-testid={`badge-material-level-${material.id}`}>
            {material.level.charAt(0).toUpperCase() + material.level.slice(1)}
          </span>
          <span className={`${material.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-accent/10 text-accent'} text-xs px-2 py-1 rounded`} data-testid={`badge-material-price-${material.id}`}>
            {material.isPremium ? 'Premium' : 'Free'}
          </span>
        </div>
        {material.rating && (
          <div className="flex items-center text-yellow-500 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1" data-testid={`text-material-rating-${material.id}`}>{material.rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <Button 
          className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium ${
            material.isPremium 
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          data-testid={`button-material-action-${material.id}`}
        >
          {material.isPremium ? (
            <>
              <Download className="mr-2 w-4 h-4" />
              Upgrade to Access
            </>
          ) : material.type === "Video" ? (
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
          data-testid={`button-material-preview-${material.id}`}
        >
          {material.type === "Video" ? <Bookmark className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
