import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/cards/news-card";
import type { NewsArticle } from "@shared/schema";

export default function News() {
  const { data: featuredArticle, isLoading: featuredLoading } = useQuery<NewsArticle>({
    queryKey: ["/api/news", { featured: true, limit: 1 }],
    select: (data: NewsArticle[]) => data[0], // Get the first featured article
  });

  const { data: recentArticles, isLoading: recentLoading } = useQuery<NewsArticle[]>({
    queryKey: ["/api/news", { featured: false }],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-news-title">
              Latest News & Updates
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8" data-testid="text-news-subtitle">
              Stay informed about the latest developments in nursing education, healthcare policies, and professional opportunities in Pakistan.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            {featuredLoading ? (
              <Card className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="w-full h-64 bg-muted"></div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-6 bg-muted rounded w-24"></div>
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-16 bg-muted rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-muted rounded w-32"></div>
                      <div className="h-6 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : featuredArticle ? (
              <NewsCard article={featuredArticle} featured={true} />
            ) : (
              <Card className="p-8">
                <CardContent className="text-center">
                  <h3 className="text-xl font-semibold mb-4" data-testid="text-no-featured">
                    No featured articles available
                  </h3>
                  <p className="text-muted-foreground">
                    Check back later for featured news and updates.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Side Articles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-recent-news-title">
              Recent News
            </h2>
            
            {recentLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="h-4 bg-muted rounded w-16"></div>
                        <div className="h-3 bg-muted rounded w-20"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-full mb-3"></div>
                      <div className="h-12 bg-muted rounded mb-3"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : recentArticles && recentArticles.length > 0 ? (
              <div className="space-y-6">
                {recentArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <Card className="p-6">
                <CardContent className="text-center">
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-no-recent">
                    No recent articles
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    No recent news articles are available at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-16 p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-0">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-card-foreground mb-4" data-testid="text-newsletter-title">
                Stay Updated
              </h2>
              <p className="text-lg text-muted-foreground mb-8" data-testid="text-newsletter-subtitle">
                Subscribe to our newsletter to receive the latest nursing education news, exam updates, and career opportunities directly in your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                  data-testid="input-newsletter-email"
                />
                <Button 
                  className="px-8 py-3 whitespace-nowrap"
                  data-testid="button-newsletter-subscribe"
                >
                  Subscribe
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4" data-testid="text-newsletter-disclaimer">
                By subscribing, you agree to receive emails from NurseEd Pakistan. You can unsubscribe at any time.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8" data-testid="text-categories-title">
            News Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer" data-testid="card-category-policy">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-primary font-bold text-lg">📋</div>
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-category-policy-title">Healthcare Policy</h3>
              <p className="text-muted-foreground text-sm" data-testid="text-category-policy-description">
                Latest updates on nursing regulations, accreditation standards, and healthcare policies in Pakistan.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer" data-testid="card-category-exams">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-secondary font-bold text-lg">📝</div>
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-category-exams-title">Exam Updates</h3>
              <p className="text-muted-foreground text-sm" data-testid="text-category-exams-description">
                Information about NCLEX-RN, MOH, and SNLE exam schedules, changes, and test center updates.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer" data-testid="card-category-career">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-accent font-bold text-lg">💼</div>
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-category-career-title">Career Opportunities</h3>
              <p className="text-muted-foreground text-sm" data-testid="text-category-career-description">
                Job openings, recruitment drives, and career advancement opportunities for nursing professionals.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer" data-testid="card-category-technology">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-yellow-600 font-bold text-lg">🔬</div>
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-category-technology-title">Healthcare Technology</h3>
              <p className="text-muted-foreground text-sm" data-testid="text-category-technology-description">
                Latest developments in healthcare technology, digital health records, and nursing informatics.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
