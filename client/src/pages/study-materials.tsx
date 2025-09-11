import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaterialCard from "@/components/cards/material-card";
import { STUDY_MATERIAL_CATEGORIES } from "@/lib/constants";
import type { StudyMaterial } from "@shared/schema";

export default function StudyMaterials() {
  const [selectedCategory, setSelectedCategory] = useState("All Materials");

  const { data: materials, isLoading } = useQuery<StudyMaterial[]>({
    queryKey: ["/api/study-materials", { category: selectedCategory }],
  });

  const filteredMaterials = materials?.filter(material => {
    if (selectedCategory === "All Materials") return true;
    return material.category === selectedCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-accent to-primary text-accent-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-materials-title">
              Study Materials Library
            </h1>
            <p className="text-xl text-accent-foreground/90 mb-8" data-testid="text-materials-subtitle">
              Access comprehensive study resources including textbooks, reference guides, and practice materials organized by subject and expertise level.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {STUDY_MATERIAL_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground hover:bg-muted"
              }`}
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-category-${category.toLowerCase().replace(" ", "-")}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Materials Count */}
        <div className="mb-6">
          <p className="text-muted-foreground" data-testid="text-materials-count">
            {isLoading ? "Loading..." : `${filteredMaterials.length} materials available`}
            {selectedCategory !== "All Materials" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Materials Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-10 bg-muted rounded"></div>
                    <div className="w-10 h-10 bg-muted rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredMaterials.length === 0 ? (
          <Card className="p-8">
            <CardContent className="text-center">
              <h3 className="text-xl font-semibold mb-4" data-testid="text-no-materials">
                No materials found
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategory === "All Materials"
                  ? "No study materials are currently available."
                  : `No materials found in the ${selectedCategory} category.`}
              </p>
              {selectedCategory !== "All Materials" && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory("All Materials")}
                  data-testid="button-show-all-materials"
                >
                  Show All Materials
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>

            {/* Load More Button */}
            {filteredMaterials.length >= 9 && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  data-testid="button-load-more-materials"
                >
                  Load More Materials
                </Button>
              </div>
            )}
          </>
        )}

        {/* Study Tips Section */}
        <Card className="mt-16 p-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-0">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-card-foreground mb-4" data-testid="text-study-tips-title">
                Study Tips for Success
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Maximize your learning potential with these evidence-based study strategies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid="text-tip-title-1">Active Reading</h3>
                <p className="text-muted-foreground text-sm" data-testid="text-tip-description-1">
                  Take notes, summarize key points, and ask yourself questions while reading to improve retention.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid="text-tip-title-2">Spaced Repetition</h3>
                <p className="text-muted-foreground text-sm" data-testid="text-tip-description-2">
                  Review materials at increasing intervals to strengthen long-term memory and recall.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid="text-tip-title-3">Practice Testing</h3>
                <p className="text-muted-foreground text-sm" data-testid="text-tip-description-3">
                  Regularly test yourself with practice questions to identify knowledge gaps and improve performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
