import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import CollegeCard from "@/components/cards/college-card";
import { COLLEGE_CITIES, COLLEGE_PROGRAMS } from "@/lib/constants";
import type { College } from "@shared/schema";

export default function Colleges() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedProgram, setSelectedProgram] = useState("All Programs");

  const { data: colleges, isLoading } = useQuery<College[]>({
    queryKey: ["/api/colleges", { city: selectedCity, programs: selectedProgram }],
  });

  const filteredColleges = colleges?.filter(college => {
    const matchesSearch = searchTerm === "" || 
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const handleSearch = () => {
    // Search is automatically handled by the filter effect
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-colleges-title">
              Nursing Colleges Directory
            </h1>
            <p className="text-xl text-secondary-foreground/90 mb-8" data-testid="text-colleges-subtitle">
              Comprehensive database of nursing institutions across Pakistan with detailed information about programs, admissions, and facilities.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="block text-sm font-medium text-card-foreground mb-2">
                  Search Colleges
                </Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter college name or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-colleges"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-card-foreground mb-2">
                  City
                </Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger data-testid="select-city">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLEGE_CITIES.map((city) => (
                      <SelectItem key={city} value={city} data-testid={`select-option-city-${city.toLowerCase().replace(' ', '-')}`}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-card-foreground mb-2">
                  Program Type
                </Label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger data-testid="select-program">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLEGE_PROGRAMS.map((program) => (
                      <SelectItem key={program} value={program} data-testid={`select-option-program-${program.toLowerCase().replace(' ', '-')}`}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  className="w-full" 
                  onClick={handleSearch}
                  data-testid="button-search"
                >
                  <Search className="mr-2 w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground" data-testid="text-results-count">
            {isLoading ? "Loading..." : `Found ${filteredColleges.length} colleges`}
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCity !== "All Cities" && ` in ${selectedCity}`}
            {selectedProgram !== "All Programs" && ` offering ${selectedProgram}`}
          </p>
        </div>

        {/* College Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-16 bg-muted rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredColleges.length === 0 ? (
          <Card className="p-8">
            <CardContent className="text-center">
              <h3 className="text-xl font-semibold mb-4" data-testid="text-no-results">No colleges found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find more colleges.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("All Cities");
                  setSelectedProgram("All Programs");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>

            {/* Load More Button */}
            {filteredColleges.length >= 10 && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  data-testid="button-load-more"
                >
                  Load More Colleges
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
